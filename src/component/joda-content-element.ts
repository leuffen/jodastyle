import {customElement, ka_create_element, ka_sleep} from "@kasimirjs/embed";
import {Jodasplit} from "../processor/jodasplit";
import {Jodastyle} from "../processor/jodastyle";
import {getCurrentBreakpoint, Jodaresponsive} from "../processor/jodaresponsive";
import {Logger} from "../helper/logger";
import {JodaImageProc} from "../processor/jodaimageproc";


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

console.time("jodaTime");

@customElement("joda-content")
export class JodaContentElement extends HTMLElement {

    #origContentTemplate: HTMLTemplateElement;
    #outputDiv : HTMLDivElement;


    async awaitStyles() {
        let index = 0;
        while(true) {
            index++;
            if (getComputedStyle(this).getPropertyValue("--joda-init") === "true") {
                break;
            }
            if (index > 100) {
                index = 0;
                console.warn("Still waiting for --joda-init: true", this, "current value:", getComputedStyle(this).getPropertyValue("--joda-init"));
            }
            await ka_sleep(10 + index);
        }
    }


    async connectedCallback() {

        let logger = new Logger("joda-content");
        await ka_sleep(1);


        let jodaImage = new JodaImageProc(logger);
        await jodaImage.process(this);

        this.#origContentTemplate = ka_create_element("template") as HTMLTemplateElement;
        this.#outputDiv = ka_create_element("div") as HTMLDivElement;
        this.#origContentTemplate.innerHTML = this.innerHTML;
        this.innerHTML = "";
        this.appendChild(this.#origContentTemplate);
        this.appendChild(this.#outputDiv);

        console.timeLog("time")

        let jodaSplit = new Jodasplit(logger);
        let jodaresponsive = new Jodaresponsive(logger);
        let currentBreakpoint = getCurrentBreakpoint();

        // Split the content
        this.#outputDiv.appendChild(jodaSplit.process(this.#origContentTemplate.content.cloneNode(true) as DocumentFragment));

        // Wait for styles to load
        await this.awaitStyles();

        // Process the content
        for(let child of Array.from(this.#outputDiv.childNodes)) {
            let jodaStyle = new Jodastyle(logger);

            await jodaStyle.process(child as HTMLElement);

        };

        jodaresponsive.process(this.#outputDiv as HTMLElement);
        console.timeLog("jodaTime")

        await ka_sleep(1);
        this.classList.add("loaded");

        await ka_sleep(1);
        if (this.hasAttribute("data-master")) {
            document.body.classList.add("loaded");
        }

        window.addEventListener("resize", () => {
            if (currentBreakpoint === getCurrentBreakpoint()) {
                return;
            }
            currentBreakpoint = getCurrentBreakpoint();
            logger.log("Breakpoint changed to " + currentBreakpoint);
            this.#outputDiv.childNodes.forEach( (child) => {
                jodaresponsive.process(child as HTMLElement);
            });
        });
    }



}
