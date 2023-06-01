import {customElement, ka_dom_ready, ka_sleep} from "@kasimirjs/embed";
import {Jodasplit} from "../processor/jodasplit";
import {Logger} from "../helper/logger";


@customElement('joda-split')
class JodaSplit extends HTMLElement {

    async connectedCallback() {
        let logger = new Logger("joda-split");
        await ka_sleep(1);
        let jodaSplit = new Jodasplit(logger);

        let fragment = document.createDocumentFragment();


        fragment.append(jodaSplit.process(this));
        this.innerHTML = "";
        this.append(fragment);
    }
}
