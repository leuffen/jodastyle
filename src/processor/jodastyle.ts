import {jodaStyleCommands} from "./jodastyle-commands";
import {Logger} from "../helper/logger";
import {getCleanVariableValue} from "../helper/functions";
import {ka_sleep} from "@kasimirjs/embed";
import {JodaElementException} from "../helper/JodaElementException";
import {JodaErrorElement} from "../helper/JodaErrorElement";
import {LayoutProcessor} from "./LayoutProcessor";


export class Jodastyle {


    constructor(public logger : Logger) {
    }

    public async process(node : HTMLElement) {

        // Wait for all joda-split to be ready
        for (let child of Array.from(node.getElementsByTagName("joda-split"))) {
            while (child["ready"] !== true) {
                await ka_sleep(5);
            }
        }

        // Run layout-attribute processor (for whole style - already running on joda-split)
        let layoutProcessor = new LayoutProcessor(this.logger);
        node.querySelectorAll("[layout]").forEach((node) => {
            layoutProcessor.processNode(node as HTMLElement);
        });

        // Run jodastyle commands
        for (let child of [node, ...Array.from(node.querySelectorAll<HTMLElement>("*"))]) {
            if (child["joda-style-processed"] === true) {
                continue;
            }
            child["joda-style-processed"] = true;

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
                try {
                    child = await command(styleValue, node as HTMLDivElement, child, this.logger) as HTMLElement;

                } catch (e) {
                    if (e instanceof JodaElementException) {
                        e.triggerCommand = key + ": " + styleValue;
                        this.logger.warn(e.message, e.element);
                        child.replaceWith(new JodaErrorElement(e.message + " (trigger by: " + e.triggerCommand + ")"));
                    } else {
                        this.logger.warn("Unhandled exception", e, "on element", child, "triggered by", key + ": " + styleValue);
                        throw e;
                    }
                }

            }
            await this.process(child); // Recursive parse replaced elements
        }

    }
}
