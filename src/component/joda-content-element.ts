import {customElement, ka_create_element, ka_sleep} from "@kasimirjs/embed";
import {Jodasplit} from "../processor/jodasplit";
import {Jodastyle} from "../processor/jodastyle";
import {getCurrentBreakpoint, Jodaresponsive} from "../processor/jodaresponsive";
import {Logger} from "../helper/logger";
import {JodaImageProc} from "../processor/jodaimageproc";
import {Jodavisualize} from "../processor/jodavisualize";


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
            let initValue = getComputedStyle(this).getPropertyValue("--joda-init")
            if (initValue.indexOf("true") !== -1) {
                break;
            }
            if (index > 100) {
                index = 0;
                console.warn("Still waiting for --joda-init: true", this, "current value:", initValue, "on url", window.location.href);
            }
            await ka_sleep(50 + index);
        }
    }

    protected async setLoaded() {
        await ka_sleep(10);
        this.classList.add("loaded");

        await ka_sleep(100);

        document.body.classList.add("loaded");
        document.querySelector("html").classList.remove("loader");
    }


    async connectedCallback() {

        let logger = new Logger("joda-content");
        await ka_sleep(1);


        let jodaImage = new JodaImageProc(logger);
        await jodaImage.process(this);
        await this.awaitStyles();

        this.#origContentTemplate = ka_create_element("template") as HTMLTemplateElement;
        this.#outputDiv = ka_create_element("div") as HTMLDivElement;
        //this.#origContentTemplate.innerHTML = this.innerHTML;
        //this.innerHTML = "";
        //this.appendChild(this.#origContentTemplate);
        //this.appendChild(this.#outputDiv);





        // Process the content
        let jodaStyle = new Jodastyle(logger);
        await jodaStyle.process(this as HTMLElement);


        let jodaresponsive = new Jodaresponsive(logger);
        let currentBreakpoint = getCurrentBreakpoint();
        jodaresponsive.process(this as HTMLElement);

        // For documentation: Add Class and Tag-Names
        if(this.hasAttribute("visualize")) {
            logger.log("Adding class and tag names");
            (new Jodavisualize()).process(this.#outputDiv as HTMLElement);
        }

        this.setLoaded();


        window.addEventListener("resize", () => {
            if (currentBreakpoint === getCurrentBreakpoint()) {
                return;
            }
            currentBreakpoint = getCurrentBreakpoint();
            logger.log("Breakpoint changed to " + currentBreakpoint);

            jodaresponsive.process(this as HTMLElement);

        });
    }



    public setContent(content: string) {
        this.innerHTML = content;
        this.connectedCallback()
    }
}
