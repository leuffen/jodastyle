import {createElementTree} from "../helper/ka-quick-template";
import {ka_sleep} from "@kasimirjs/embed";
import {await_property} from "../helper/functions";
import {JodaTemplate} from "../types/JodaTemplate";
import {JodaRendererInterface} from "../helper/JodaRenderer";

type Commands = {
    [command: string]: ((value : string, target : HTMLDivElement, element : HTMLElement) => HTMLElement|Promise<HTMLElement>);
}

export let jodaStyleCommands : Commands = {};



jodaStyleCommands["--joda-replace-by"] = (value : string, target, element : HTMLElement) => {
    let parent = element.parentElement;
    let ret = createElementTree(value)

    parent.replaceChild(ret.start, element);

    Array.from(element.children).forEach((child) => {
        ret.leaf.append(child);
    });
    element.remove();
    return ret.leaf;
}

jodaStyleCommands["--joda-wrap"] = (value : string, target, element : HTMLElement) => {
    let parent = element.parentElement;
    let ret = createElementTree(value)

    parent.replaceChild(ret.start, element);

    ret.leaf.append(element);
    return element;
}

jodaStyleCommands["--joda-wrap-same"] = (value : string, target, element : HTMLElement) => {
    if (element["jodaIsWrappedSame"] !== undefined) {
        return element;
    }
    let parent = element.parentElement;
    let ret = createElementTree(value)

    parent.replaceChild(ret.start, element);


    ret.leaf.append(element);

    return element;
}

jodaStyleCommands["--joda-class"] = (value : string, target, element : HTMLElement) => {
    let ret = createElementTree(value)

    element.setAttribute("class", element.getAttribute("class") + " " + value);

    return element;
}

jodaStyleCommands["--joda-use"] = async(value : string, target, element : HTMLElement) => {
    let matches = value.match(/([a-z0-9\_-]+)\s*\((.*?)\)/);
    if ( ! matches) {
        console.error("Invalid --joda-use command: ", value, "in element", element, " should be in format: commandName(arg1: value1, arg2: value2, ...)");
        throw "Invalid --joda-use command: " + value + " should be in format: commandName(arg1: value1, arg2: value2, ...)";
    }
    let commandName = matches[1];
    let args = JSON.parse("{" + matches[2] + "}");
    let command = await await_property(window, ["jodastyle", "renderer", commandName]) as JodaRendererInterface;


    return (new command).render(element, args);
}
