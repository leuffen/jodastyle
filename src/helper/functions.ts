import {ka_sleep, template} from "@kasimirjs/embed";
import {JodaRendererInterface} from "./JodaRenderer";
import {DefaultLayout} from "../types/DefaultLayout";
import {JodaElementException} from "./JodaElementException";
import {QTemplate, template_parse} from "./QTemplate";
import {Joda} from "../joda";
import {JodaErrorElement} from "./JodaErrorElement";



export let allTemplatesConnectedCallbacks : any[] = [];


export async function await_property(object : object, property : string[] | string, wait : number = 10) {
    if (typeof property === "string") {
        property = property.split(".");
    }
    let value = undefined;
    let index = 0;
    while (value === undefined) {
        index++;
        let curObject = object;
        for (let i = 0; i < property.length; i++) {
            if (curObject === undefined) {
                break;
            }
            curObject = curObject[property[i]];
        }
        value = curObject;
        if (value === undefined)
            await ka_sleep(wait);
        if (index > 1000) {
            index = 0;
            console.warn("Still waiting for property: ", property, "in object", object);
        }

    }
    return value;
}


export function wrapElement(element : HTMLElement, wrapper : HTMLElement) {
    element.parentNode?.insertBefore(wrapper, element);
    wrapper.appendChild(element);
}


export type JodaUseRenderer = {
    renderer: new() => JodaRendererInterface,
    config: new() => DefaultLayout
}

export function registerJodaRenderer(name : string, renderer : new() => JodaRendererInterface, config : new() => DefaultLayout) {
    if (window["jodastyle"] === undefined) {
        window["jodastyle"] = {};
    }
    if (window["jodastyle"]["renderer"] === undefined) {
        window["jodastyle"]["renderer"] = {};
    }
    window["jodastyle"]["renderer"][name] = {renderer, config};
}


export function jodaRenderer(name : string, config : new() => DefaultLayout) {
    return function (classOrDescriptor: new() => JodaRendererInterface) : void {
        registerJodaRenderer(name, classOrDescriptor, config);
    }
}


export function splitChildrenBySelector(element : HTMLElement, splitBySelctor : string) : DocumentFragment[] {
    let ret : DocumentFragment[] = [];
    Array.from(element.children).forEach(child => {
        if (child.matches(splitBySelctor)) {
            ret.push(document.createDocumentFragment());
        }
        if (ret.length > 0) {
            ret[ret.length - 1].append(child);
        }
    });
    return ret;
}

export function getCleanVariableValue(styleValue : string) : string {
    return styleValue.trim().replace(/^["']/g, '').replace(/["']$/, '').trim()
}


/**
 * Parse config string formattes as key-value pairs like this: key1: value1; key2: value2; ... into an object.
 *
 * @param input String representing key-value pair separated by colon and each line separated by semicolon
 * @returns Object containing key-value pairs from string
 */
export function parseConfigString(input: string): {[key: string]: string} {
    // Check if input is null or undefined
    if (input == null) {
        return {};
    }

    // Split input string and filter invalid lines
    const obj: {[key: string]: string} = {};
    const lines = input.trim().split(';');
    for (let line of lines) {
        const parts = line.trim().split(':');
        if (parts.length == 2) {
            obj[parts[0].trim()] = parts[1].trim();
        }
    }

    return obj;
}


/**
 * Copy all data-child-* attributes from source to target element
 *
 * e.g. <slot data-child-class="abc"> Will result in <div class="abc">
 *     Also: <slot data-child-layout="use: #someElement"> Will result in <div layout="use: #someElement">
 * @param source
 * @param target
 */
function copyDataChildAttributes(source : HTMLElement, target : HTMLElement) {
    Array.from(source.attributes).forEach((attr) => {
        if (attr.name.startsWith("data-child-")) {
            // if attribute is class, append classed to existing class attribute
            if (attr.name === "data-child-class") {
                target.classList.add(...attr.value.split(" ").filter((value) => value !== ""));
                return;
            }
            target.setAttribute(attr.name.substring(11), attr.value);
        }
    });
}


/**
 * Allow multiple Queries separated by || statement. Returns first element found
 *
 * @param selector
 * @param element
 * @param limit
 * @returns Element found
 */
function queryMulti (selector : string, element : HTMLElement, limit : number = null) : Element[] {

    let selectors = selector.split("||");
    for (let sel of selectors) {
        sel = sel.trim();
        if (sel === "")
            return [element];
        try {
            let found = element.querySelectorAll(sel);
            if (found.length === 0)
                continue;
            if (limit === null) {
                return Array.from(found);
            }

            return Array.from(found).slice(0, limit);
        } catch (e) {
            console.warn("Invalid selector: ", sel, "on element", element);
            return [new JodaErrorElement("Invalid selector: " + sel + " on element " + element)];
            continue;
        }


    }
    return [];
}


let slotIndex = 0;
export async function getTemplateFilledWithContent(templateSelector : string, content : HTMLElement, origElement : HTMLElement) : Promise<DocumentFragment> {
    let templateConfig = Joda.getRegisteredTemplate(templateSelector);
    let templateHtml = templateConfig?.template ?? null;

    if (templateHtml === null) {
        let template = document.querySelector<HTMLTemplateElement>(templateSelector);
        if (template === null) {
            throw new JodaElementException("Template not found: " + templateSelector);
        }
        templateHtml = template.innerHTML;
    }



    // Load --layout-* variables to template parser


    let props = getComputedStyle(origElement);



    // Attention: Chrome cannot list defined CSS Variables!
    templateHtml =  template_parse(templateHtml, {
        layout: new Proxy({}, {
            get: function (target, name) {
                let val =  props.getPropertyValue("--layout-" + name.toString());

                if(val === "") {
                    // Return default from template config
                    return templateConfig?.layoutDefaults[name.toString()] ?? "";
                }

                if (val === "true")
                    return true;
                if (val === "false")
                    return false;
                return val;
            }
        })
    }, content);

    let clone = document.createRange().createContextualFragment(templateHtml);

    let done = [];

    clone.querySelectorAll("slot[data-select][data-copy]").forEach((slot) => {
        if (done.includes(slot)) {
            return;
        }
        done.push(slot);

        slot.setAttribute("_slotIndex", (++slotIndex).toString());
        let select = slot.getAttribute("data-select");

        let selected : any;
        if (slot.getAttribute("data-limit") === "1") {
            selected = queryMulti(select, content, 1).map((element) => element.cloneNode(true));
        } else {
            selected = queryMulti(select, content).map((element) => element.cloneNode(true));
        }

        selected.forEach((element) => {
            copyDataChildAttributes(slot as HTMLElement, element);
        })

        if (selected.length === 0) {
            slot.classList.add("emptyslot");
            console.warn("No element found for selector: " + select + " in template: " + templateSelector + " for slot: ", slot);
            return;
        }
        if (slot.hasAttribute("data-replace") && selected) {
            slot.replaceWith(...selected);
        } else if(selected) {
            slot.append(...selected);
        }
    });
    clone.querySelectorAll("slot[data-select]").forEach((slot) => {
        if (done.includes(slot)) {
            return;
        }
        done.push(slot);

        slot.setAttribute("_slotIndex", (++slotIndex).toString());
        let select = slot.getAttribute("data-select");



        let selected: any;
        if (slot.getAttribute("data-limit") === "1") {
            selected = queryMulti(select, content, 1)
        } else {
            selected = queryMulti(select, content)
        }
        if (selected.length === 0) {
            slot.classList.add("emptyslot");
            console.warn("No element found for selector: " + select + " in template: " + templateSelector + " for slot: ", slot);
            return;
        }
        selected.forEach((element) => {
            copyDataChildAttributes(slot as HTMLElement, element);
        })



        if (slot.hasAttribute("data-replace") && selected) {
            slot.replaceWith(...selected);
        } else if(selected) {
            slot.append(...selected);
        }
    });

    // Select <slot> element with no data-select attribute
    let slot = clone.querySelector("slot:not([data-select])");
    if (slot !== null && slot.hasAttribute("data-class")) {
        if (done.includes(slot)) {
            return;
        }
        done.push(slot);

        slot.setAttribute("_slotIndex", (++slotIndex).toString());
        Array.from(content.children).forEach((element) => {
            // Add all classes from data-class attribute to selected element
            element.classList.add(...slot.getAttribute("data-class").split(" ").filter((value) => value !== ""));
        });
    }
    if (slot !== null && slot.hasAttribute("data-replace")) {
        slot.replaceWith(...Array.from(content.children));
    } else if (slot !== null) {
        let addChildren = Array.from(content.children);
        if (addChildren.length === 0) {
            slot.classList.add("emptyslot");
        }
        slot.append(...addChildren);
    } else {
        content.remove();
    }



    return clone;
}



export async function runCallbacksForTemplate(templateSelector: string , element : HTMLElement) {
    let templateConfig = Joda.getRegisteredTemplate(templateSelector);
    if (templateConfig?.callbacks?.onAfterConnectedCallback) {
        await templateConfig.callbacks.onAfterConnectedCallback(element as HTMLElement);
    }
    if (templateConfig?.callbacks?.onAfterAllTemplatesConnectedCallback) {
        // Spool up callback (executed by jodastyle)
        allTemplatesConnectedCallbacks.push(async() => templateConfig.callbacks.onAfterAllTemplatesConnectedCallback(element as HTMLElement));
    }
}
