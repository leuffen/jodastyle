import {ka_create_element} from "@kasimirjs/embed";
import {Logger} from "../helper/logger";


interface JodaSplitConfig {


}


export class Jodasplit {
    #target = document.createDocumentFragment();
    #parents = [this.#target];
    #currentParent : HTMLElement = ka_create_element("section", {class: "section-h1pre"})


    constructor(public logger : Logger) {
    }

    private findParentElement(layer : number) : HTMLElement | DocumentFragment {
        while (this.#parents.length > layer) {
            this.#parents.pop();
        }
        while (this.#parents[this.#parents.length - 1] === undefined) {
            this.#parents.pop();
        }
        return this.#parents[this.#parents.length - 1];
    }


    private createNewElement(tagName : string, layer : number, tag : string) : HTMLElement {
        tagName = tagName.toLowerCase();
        let curParent = this.findParentElement(layer)
        //console.log("createNewElement", tagName, curParent, this.#parents);
        this.#currentParent =  ka_create_element(tag, {class: "section-" + tagName});
        while (this.#parents.length < layer) {
            this.#parents.push(undefined as any);
        }
        this.#parents.push(this.#currentParent as any);
        curParent.appendChild(this.#currentParent);
        return this.#currentParent;
    }

    process (source : DocumentFragment) : DocumentFragment {
        let lastLayer = 1;
        this.#target.append(this.#currentParent);
        Array.from(source.children).forEach((child : Element) => {

            if (child instanceof HTMLElement && child.matches("h1, h2, h3, h4, h5, h6, h7, h8, h9, hr")) {
                let layer = 1;
                let tag = "div";

                if (child.matches("h1, h2")) {
                    layer = lastLayer = 1;
                    tag = "section";
                } else if (child.matches("h3, h4, h5, h6, h7, h8, h9")) {
                    layer = lastLayer = parseInt(child.tagName.substr(1)) * 2; // Allow HR in between
                    tag = "div";
                } else if (child.matches("hr")) {
                    layer = lastLayer + 1; // hr crates subelement of the last element
                    tag = "div";
                }

                let e = this.createNewElement(child.tagName.toLowerCase(), layer, tag);
                e.classList.add(...child.classList as any);
            }
            this.#currentParent.appendChild(child);
        });
        return this.#target;
    }
}
