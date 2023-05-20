import {jodaStyleCommands} from "./jodastyle-commands";


export class Jodastyle {



    public process(node : HTMLElement) {

        Array.from(node.querySelectorAll<HTMLElement>("*")).forEach((child) => {
            let style = getComputedStyle(child);
            let keys = Object.keys(jodaStyleCommands);
            Array.from(keys).forEach((key) => {
                let styleValue = style.getPropertyValue(key);
                if (styleValue === "") {
                    return;
                }
                if (styleValue === getComputedStyle(child.parentElement).getPropertyValue(key)) {
                    return; // Inherited from parent
                }

                // Replace starting and ending with " or ' with nothing
                styleValue = styleValue.trim().replace(/^["']/g, '').replace(/["']$/, '').trim();

                let command = jodaStyleCommands[key];
                child = command(styleValue, node as HTMLDivElement, child) as HTMLElement;

            });
        });


    }
}
