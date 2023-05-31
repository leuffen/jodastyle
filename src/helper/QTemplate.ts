import {ka_eval} from "@kasimirjs/embed";
import {ka_create_element} from "@kasimirjs/embed";


/**
 * Searches for occurence of ${javascript expression} and replaces them with the result of the expression
 */
export function template_parse(input : string, scope : {}, element: HTMLElement | null) : string {
    // Search for ${...} by preg and replace them with the result of the expression

    return input.replace(/\[\[(.*?)]]/gmi, (match, p1) => {
        let val =  ka_eval(p1, scope, element, {});
        return val;
    });
}


export class QTemplate {

    public content : HTMLElement | HTMLDivElement

    public selected : HTMLElement | HTMLDivElement | null;

    constructor(content:  HTMLTemplateElement | HTMLElement | HTMLDivElement | string) {
        if (typeof content === "string") {
            this.content = ka_create_element("template");
            this.content.innerHTML = content;
        } else {
            this.content = content;
        }
        if (this.content instanceof HTMLTemplateElement) {
            if (this.content.content.children.length > 1) {
                throw new Error("Template must have exactly one root element. Found: " + this.content.innerHTML);
            }

            this.content = this.content.content.firstElementChild.cloneNode(true) as HTMLElement | HTMLDivElement;
        }
        this.selected = null;

    }
    parse(scope : {}) : this {
        let tpl = ka_create_element("template", {}, [], null) as HTMLTemplateElement;
        tpl.content.append(this.content);

        //console.log("Parse", this.content, this.content.toString());
        tpl.innerHTML =  template_parse(tpl.innerHTML, scope, tpl);
        this.content = tpl.content.firstElementChild as HTMLElement | HTMLDivElement;
        return this;
    }

    /**
     * Returns the element with the given data-ref attribute
     * @param data_ref
     */
    public by(data_ref : string) : HTMLDivElement | HTMLElement {
        let selector = `[data-ref="${data_ref}"]`;
        if (this.content.matches(selector)) {
            return this.content;
        }
        return this.content.querySelector(selector);
    }

    public select(data_ref : string) : this {
        this.selected = this.by(data_ref);
        if (this.selected === null) {
            console.error("Element with data-ref '" + data_ref + "' not found.", this.content)
            throw "Element with data-ref '" + data_ref + "' not found."
        }
        return this;
    }

    /**
     * Pick elements by selector and append them to the selected element
     *
     * @param source
     * @param selector
     */
    public pick(source : HTMLElement, selector : string, modifier : (e : HTMLElement) => HTMLElement = null) : this {
        Array.from(source.querySelectorAll(selector)).forEach((e: HTMLElement) => {
            if (modifier !== null) {
                e = modifier(e);
            }
            this.selected.append(e);
        });
        return this;
    }

    /**
     * Select and return own wrapper
     *
     * @param data_ref
     */
    public with(data_ref : string) {
        let instance = new QTemplate(this.content);
        instance.select(data_ref);
        return instance;
    }

    public append(element : Node | HTMLElement | Array<HTMLElement> | NodeList | DocumentFragment | QTemplate) : this {
        if (element instanceof QTemplate) {
            this.selected.append(element.content);
            return this;
        }
        if (element instanceof NodeList) {
            Array.from(element).forEach(e => this.selected.append(e));
            return this;
        }
        if (Array.isArray(element) || element instanceof NodeList) {
            element.forEach(e => this.selected.append(e));
            return this;
        }
        this.selected.append(element);
        return this;
    }

    public clone() : QTemplate {
        return new QTemplate(this.content.cloneNode(true) as HTMLElement | HTMLDivElement);
    }

}
