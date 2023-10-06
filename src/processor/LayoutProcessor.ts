import {Logger} from "../helper/logger";
import {parseConfigString} from "../helper/functions";


const commands = ["use", "wrap"];

export class LayoutProcessor {

    public constructor(public logger : Logger) {
    }


    public processNode(node : HTMLElement) : HTMLElement {
        if ( ! node.hasAttribute("layout"))
            return node;

        let layout = parseConfigString(node.getAttribute("layout"));


        for (let key in layout) {
            if (commands.includes(key)) {
                node.style.setProperty("--joda-" + key, layout[key]);
                continue;
            }
            node.style.setProperty("--layout-" + key, layout[key]);
        }

        return node;
    }

}
