import {customElement, ka_dom_ready, ka_sleep} from "@kasimirjs/embed";
import {Jodasplit} from "../processor/jodasplit";
import {Logger} from "../helper/logger";
import {Jodashorts} from "../processor/jodashorts";
import {jodaSiteConfig} from "../helper/JodaSiteConfig";


@customElement('joda-split')
class JodaSplit extends HTMLElement {
    #ready : boolean = false;
    get ready() {
        return this.#ready;
    }
    async connectedCallback() {
        let logger = new Logger("joda-split");
        await ka_sleep(1);

        if (jodaSiteConfig.debug_visualize) {
            this.classList.add("joda-debug-visualize");
        }
        if (jodaSiteConfig.disable_split) {
            this.#ready = true;
            return;
        }

        let jodaShorts = new Jodashorts(logger);
        this.innerHTML = await jodaShorts.process(this.innerHTML);

        let jodaSplit = new Jodasplit(logger);
        let fragment = document.createDocumentFragment();


        fragment.append(await jodaSplit.process(this));
        this.innerHTML = "";
        this.append(fragment);
        this.#ready = true;
    }
}
