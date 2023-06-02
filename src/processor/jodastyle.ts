import {jodaStyleCommands} from "./jodastyle-commands";
import {Logger} from "../helper/logger";
import {getCleanVariableValue} from "../helper/functions";
import {ka_sleep} from "@kasimirjs/embed";


export class Jodastyle {


    constructor(public logger : Logger) {
    }

    public async process(node : HTMLElement) {
        for (let child of Array.from(node.getElementsByTagName("joda-split"))) {
            while (child.ready !== true) {
                await ka_sleep(5);
            }
        }
        for (let child of [node, ...Array.from(node.querySelectorAll<HTMLElement>("*"))]) {
            let style = getComputedStyle(child);

            let keys = Object.keys(jodaStyleCommands);
            for (let key of Array.from(keys)) {

                let styleValue = style.getPropertyValue(key);
                if (styleValue === "") {
                    continue;
                }
                if (styleValue === getComputedStyle(child.parentElement).getPropertyValue(key)) {
                    continue; // Inherited from parent
                }

                // Replace starting and ending with " or ' with nothing
                styleValue = getCleanVariableValue(styleValue)

                let command = jodaStyleCommands[key];
                child = await command(styleValue, node as HTMLDivElement, child, this.logger) as HTMLElement;
            }
        }
    }
}
