import {ka_sleep} from "@kasimirjs/embed";
import {JodaRendererInterface} from "./JodaRenderer";
import {DefaultLayout} from "../types/DefaultLayout";


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
        console.log(classOrDescriptor);
        registerJodaRenderer(name, classOrDescriptor, config);
    }
}


