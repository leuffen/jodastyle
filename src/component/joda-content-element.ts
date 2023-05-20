import {customElement, ka_create_element, ka_sleep} from "@kasimirjs/embed";
import {commands} from "./commands";
import {Jodasplit} from "../processor/jodasplit";
import {Jodastyle} from "../processor/jodastyle";
import {getCurrentBreakpoint, Jodaresponsive} from "../processor/jodaresponsive";


function getCSSRule(ruleName : string) : CSSStyleRule {
    ruleName = ruleName.toLowerCase();
    var result = null;
    var find = Array.prototype.find;

    find.call(document.styleSheets, styleSheet => {
        result = find.call(styleSheet.cssRules, cssRule => {
            return cssRule instanceof CSSStyleRule
                && cssRule.selectorText.toLowerCase() == ruleName;
        });
        return result != null;
    });
    return result;
}



@customElement("joda-content")
export class JodaContentElement extends HTMLElement {

    #origContentTemplate: HTMLTemplateElement;
    #outputDiv : HTMLDivElement;


    async connectedCallback() {
        await ka_sleep(1);
        console.time("time");
        this.#origContentTemplate = ka_create_element("template") as HTMLTemplateElement;
        this.#outputDiv = ka_create_element("div") as HTMLDivElement;
        this.#origContentTemplate.innerHTML = this.innerHTML;
        this.innerHTML = "";
        this.appendChild(this.#origContentTemplate);
        this.appendChild(this.#outputDiv);

        console.timeLog("time")

        let jodaSplit = new Jodasplit();
        let jodaresponsive = new Jodaresponsive();
        let currentBreakpoint = getCurrentBreakpoint();
        this.#outputDiv.appendChild(jodaSplit.process(this.#origContentTemplate.content.cloneNode(true) as DocumentFragment));
        console.timeLog("time")
        this.#outputDiv.childNodes.forEach( (child) => {
            let jodaStyle = new Jodastyle();

            jodaStyle.process(child);


            jodaresponsive.process(child);
            console.timeLog("time");
        });

        console.timeEnd("time")

        window.addEventListener("resize", () => {
            if (currentBreakpoint === getCurrentBreakpoint()) {
                return;
            }
            currentBreakpoint = getCurrentBreakpoint();
            this.#outputDiv.childNodes.forEach( (child) => {
                jodaresponsive.process(child);
            });
        });
    }



}
