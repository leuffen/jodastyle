import {createElementTree} from "../helper/ka-quick-template";
import {
    await_property,
    getCleanVariableValue,
    getTemplateFilledWithContent,
    JodaUseRenderer, runCallbacksForTemplate
} from "../helper/functions";
import {Logger} from "../helper/logger";
import {ka_eval} from "@kasimirjs/embed";
import {JodaErrorElement} from "../helper/JodaErrorElement";
import {JodaElementException} from "../helper/JodaElementException";

type Commands = {
    [command: string]: ((value : string, target : HTMLDivElement, element : HTMLElement, logger : Logger) => HTMLElement|Promise<HTMLElement>|Element|Promise<Element>);
}

export let jodaStyleCommands : Commands = {};


/**
 * Replace the element with the given @class > @id=elementId template
 *
 * @param value
 * @param target
 * @param element
 * @param logger
 */
jodaStyleCommands["--joda-replace-by"] = (value : string, target, element : HTMLElement, logger : Logger) => {
    let parent = element.parentElement;
    let ret = createElementTree(value)

    parent.replaceChild(ret.start, element);

    Array.from(element.children).forEach((child) => {
        ret.leaf.append(child);
    });
    element.remove();
    return ret.leaf;
}

/**
 * Wrap the selected element with the Template
 *
 * @param value
 * @param target
 * @param element
 * @param logger
 */
jodaStyleCommands["--joda-wrap"] = async (value : string, target, element : HTMLElement, logger : Logger) => {
    let parent = element.parentElement;

    if (value.startsWith("#")) {
        console.log("Wrap element", element, "with template", value);

        let placeholder = document.createElement("div");
        parent.insertBefore(placeholder, element);

        // Move Element to placeholder (to be able to access it in <slot>)
        placeholder.append(element);

        let newElement = await getTemplateFilledWithContent(value, placeholder, element);
        placeholder.replaceWith(newElement);

        await runCallbacksForTemplate(value, element as HTMLElement);


        return element;

    } else {
        let ret = createElementTree(value)

        parent.replaceChild(ret.start, element);

        ret.leaf.append(element);
        return element;
    }
}


jodaStyleCommands["--joda-container"] = (value : string, target, element : HTMLElement, logger : Logger) => {
    let ret = createElementTree(value)

    Array.from(element.children).forEach((child) => {
        ret.leaf.append(child);
    })
    element.append(ret.start);
    return element;
};

jodaStyleCommands["--joda-unwrap"] = (value : string, target, element : HTMLElement, logger : Logger) => {
    let parent = element.parentElement;
    let grandParent = parent.parentElement;
    grandParent.insertBefore(element, parent);
    if (parent.children.length === 0) {
        parent.remove();
    }
    return element;
};


/**
 * --joda-group: @row
 * @param value
 * @param target
 * @param element
 * @param logger
 */
jodaStyleCommands["--joda-group"] = (value : string, target, element : HTMLElement, logger : Logger) => {
    const groupByKey = "jodaIsGroupedBy";
    if (element[groupByKey] !== undefined) {
        return element;
    }

    let siblings = [];
    let curSibling = element.nextElementSibling;
    while (curSibling && getCleanVariableValue(getComputedStyle(curSibling).getPropertyValue("--joda-group")) === value) {
        siblings.push(curSibling);
        curSibling[groupByKey] = true;
        curSibling = curSibling.nextElementSibling;
    }


    let parent = element.parentElement;
    let ret = createElementTree(value)

    // Insert the Element
    element.parentElement.insertBefore(ret.start, element);


    ret.leaf.append(element);
    siblings.forEach((sibling) => {
        ret.leaf.append(sibling);
    });

    return element;
}

jodaStyleCommands["--joda-class"] = (value : string, target, element : HTMLElement, logger: Logger) => {
    let ret = createElementTree(value)

    element.setAttribute("class", element.getAttribute("class") + " " + value);

    return element;
}

jodaStyleCommands["--joda-use"] = async(value : string, target, element : HTMLElement, logger : Logger) => {
    if (value.startsWith("#")) {
        let placeholder = document.createElement("div");
        Array.from(element.children).forEach((child) => {
            placeholder.append(child);
        });
        let newElement = await getTemplateFilledWithContent(value, placeholder, element);

        let firstElement = newElement.firstElementChild;
        firstElement["joda-style-processed"] = true; // Set style as processed (to prevent double processing)

        // Copy first line of the outerHTML string of the element
        let debugElement = element.outerHTML.split("\n")[0];
        firstElement.setAttribute("_orig_elem", debugElement);


        element.getAttributeNames().forEach((attrName) => {

            // copy attributes but. Append class and styles
            if (attrName === "class") {
                firstElement.setAttribute(attrName, element.getAttribute(attrName) + " " + firstElement.getAttribute(attrName));
                return;
            }
            if (attrName === "style") {
                firstElement.setAttribute(attrName, element.getAttribute(attrName) + " " + firstElement.getAttribute(attrName));
                return;
            }
            if(attrName.startsWith("layout")) {
                firstElement.setAttribute("layout-orig", element.getAttribute(attrName));
                return;
            }

            firstElement.setAttribute(attrName, element.getAttribute(attrName));
        });
        element.parentElement.insertBefore(newElement, element);
        element.parentElement.removeChild(element);
        await runCallbacksForTemplate(value, firstElement as HTMLElement);
        return firstElement;
    }


    let matches = value.match(/([a-z0-9\_-]+)\s*\((.*?)\)/);
    if ( ! matches) {
        console.error("Invalid --joda-use command: ", value, "in element", element, " should be in format: commandName(arg1: value1, arg2: value2, ...)");
        throw "Invalid --joda-use command: " + value + " should be in format: commandName(arg1: value1, arg2: value2, ...)";
    }
    logger.log("Using renderer: ", matches[1], "with args: ", matches[2], "on element", element);
    let commandName = matches[1];
    //console.log("interpret", "{" + matches[2] + "}")
    let args = ka_eval("{" + matches[2] + "}", {}, target, {});
    let command = await await_property(window, ["jodastyle", "renderer", commandName]) as JodaUseRenderer;

    let config = new command.config();
    let style = getComputedStyle(element);

    Object.keys(config).forEach((key) => {
        let val = style.getPropertyValue("--layout-" + key.replace(/\_/g, "-"));
        if (val !== "") {
            config[key] = val.replace(/^["']/g, '').replace(/["']$/, '').trim();
        }

    });
    Object.assign(config, args);

    return await (new command.renderer).render(element, config);
}


jodaStyleCommands["--joda-on-empty-class"] = async (value : string, target, element : HTMLElement, logger : Logger) => {
    console.log("Check if element is empty", element.textContent.trim(), "and add class", value);
    if (element.textContent.trim() === "") {
        element.classList.add(value);
    }
    return element
};


jodaStyleCommands["--joda-hide-empty"] = async(value : string, target, element : HTMLElement, logger : Logger) => {
    function hideEmptyElements(node : HTMLElement) {
        if (node.querySelectorAll("img, iframe").length > 0) {
            return;
        }
        if (node.textContent.trim() !== "") {
            return;
        }
        node.style.setProperty("display", "none", "important");
    }

    if (value === "true" || value === "1" || value === "yes" || value === "on") {
        hideEmptyElements(element);
    }


    return element;
}

