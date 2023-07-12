import {ka_sleep, template} from "@kasimirjs/embed";
import {JodaRendererInterface} from "./JodaRenderer";
import {DefaultLayout} from "../types/DefaultLayout";
import {JodaElementException} from "./JodaElementException";
import {QTemplate, template_parse} from "./QTemplate";
import {Joda} from "../joda";


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


let slotIndex = 0;
export async function getTemplateFilledWithContent(templateSelector : string, content : HTMLElement, origElement : HTMLElement) : DocumentFragment {
    let templateHtml : string|null = Joda.getRegisteredTemplate(templateSelector);

    if (templateHtml === null) {
        let template = document.querySelector<HTMLTemplateElement>(templateSelector);
        if (template === null) {
            throw new JodaElementException("Template not found: " + templateSelector);
        }
        templateHtml = template.innerHTML;
    }


    // Load --layout-* variables to template parser
    let layout = {};

    let props = getComputedStyle(origElement);



    // Attention: Chrome cannot list defined CSS Variables!
    templateHtml =  template_parse(templateHtml, {
        layout: new Proxy({}, {
            get: function (target, name) {
                return props.getPropertyValue("--layout-" + name);
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
        let selected = Array.from(content.querySelectorAll(select)).map((element) => element.cloneNode(true));
        if (selected.length === 0) {
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
        let selected = Array.from(content.querySelectorAll(select));
        if (selected.length === 0) {
            console.warn("No element found for selector: " + select + " in template: " + templateSelector + " for slot: ", slot);
            return;
        }

        if (slot.hasAttribute("data-class")) {
            selected.forEach((element) => {
                // Add all classes from data-class attribute to selected element
                element.classList.add(...slot.getAttribute("data-class").split(" ").filter((value) => value !== ""));
            });
        }

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
        slot.replaceWith(...content.children);
    } else if (slot !== null) {
        slot.append(...content.children);
    } else {
        content.remove();
    }

    return clone;
}
