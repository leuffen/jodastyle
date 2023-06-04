import {customElement, ka_dom_ready, ka_sleep} from "@kasimirjs/embed";
import {Jodasplit} from "../processor/jodasplit";
import {Logger} from "../helper/logger";
import {Jodashorts} from "../processor/jodashorts";


@customElement('joda-split')
class JodaSplit extends HTMLElement {
    #ready : boolean = false;
    get ready() {
        return this.#ready;
    }
    async connectedCallback() {
        let logger = new Logger("joda-split");
        await ka_sleep(1);

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
