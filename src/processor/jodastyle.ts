import {jodaStyleCommands} from "./jodastyle-commands";
import {Logger} from "../helper/logger";


export class Jodastyle {


    constructor(public logger : Logger) {
    }

    public async process(node : HTMLElement) {

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
                styleValue = styleValue.trim().replace(/^["']/g, '').replace(/["']$/, '').trim();

                let command = jodaStyleCommands[key];
                child = await command(styleValue, node as HTMLDivElement, child, this.logger) as HTMLElement;
            }
        }
    }
}
