import {createElementTree} from "../helper/ka-quick-template";

type Commands = {
    [command: string]: ((value : string, target : HTMLDivElement, element : HTMLElement) => HTMLElement);
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
jodaStyleCommands["--joda-"] = (value : string, target, element : HTMLElement) => {
    let ret = createElementTree(value)

    ret.leaf.append(element);
    return ret.start;
}
