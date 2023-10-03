import {customElement} from "@kasimirjs/embed";
import {Jodastyle} from "../processor/jodastyle";
import {Logger} from "../helper/logger";


@customElement('joda-fetch')
class JodaFetch extends HTMLElement {

    async connectedCallback() {
        let select= this.getAttribute("data-select");
        let elem = document.querySelector(select) as HTMLElement;
        if (elem === null) {
            console.error("joda-fetch: Element not found", select, "in element", this);
            return;
        }
        let jodaStyle = new Jodastyle(new Logger("joda-fetch"));
        this.innerHTML = elem.innerHTML

        await jodaStyle.process(this);


    }
}
