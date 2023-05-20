import {ka_sleep} from "@kasimirjs/embed";
import {JodaTemplate} from "../types/JodaTemplate";
import {JodaRendererInterface} from "./JodaRenderer";


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



export function registerJodaRenderer(name : string, callback : JodaRendererInterface) {
    if (window["jodastyle"] === undefined) {
        window["jodastyle"] = {};
    }
    if (window["jodastyle"]["renderer"] === undefined) {
        window["jodastyle"]["renderer"] = {};
    }
    window["jodastyle"]["renderer"][name] = callback;
}


export function jodaRenderer(name : string) {
    return function (classOrDescriptor: JodaRendererInterface) : void {
        registerJodaRenderer(name, classOrDescriptor);
    }
}
