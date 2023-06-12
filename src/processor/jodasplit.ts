import {ka_create_element} from "@kasimirjs/embed";
import {Logger} from "../helper/logger";


interface JodaSplitConfig {


}


export class Jodasplit {


    #target = document.createDocumentFragment();
    #parents = [this.#target];

    #currentParent : HTMLElement = ka_create_element("section", {class: "section-h1pre"})
    #currentContent : HTMLElement = ka_create_element("div", {class: "content"}, [], this.#currentParent);
    #currentChildren: HTMLElement = ka_create_element("div", {class: "children"}, [], this.#currentParent);

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
        let curParentChildren = curParent.childNodes[1] as HTMLElement;

        this.#currentParent =  ka_create_element(tag, {class: "section-" + tagName});
        while (this.#parents.length < layer) {
            this.#parents.push(undefined as any);
        }
        this.#parents.push(this.#currentParent as any);
        if (curParent === this.#target) {
            curParent.appendChild(this.#currentParent);
        } else {
            curParentChildren.append(this.#currentParent);
        }
        this.#currentContent = ka_create_element("div", {class: "content"}, [], this.#currentParent);
        this.#currentChildren = ka_create_element("div", {class: "children"}, [], this.#currentParent);
        return this.#currentParent;
    }

    process (source : DocumentFragment | HTMLElement) : DocumentFragment {
        let lastLayer = 1;
        this.#target.append(this.#currentParent);
        Array.from(source.children).forEach((child : Element) => {
            if (child instanceof HTMLElement && child.matches("footer")) {
                // Just copy node
                this.#target.appendChild(child);
                return;
            }
            if (child instanceof HTMLElement && child.matches("h1, h2, h3, h4, h5, h6, h7, h8, h9, hr, .section-h2, .section-h3, .section-h4")) {
                let layer = 1;
                let tag = "div";

                if (child.matches("h1,h2,.section-h2")) {
                    layer = lastLayer = 1;
                    tag = "section";
                } else if (child.matches("h3, h4, h5, h6, h7, h8, h9, .section-h3, .section-h4")) {
                    if (child.matches(".section-h3")) {
                        layer = lastLayer = 6;
                    } else if( child.matches(".section-h4")) {
                        layer = lastLayer = 8;
                    } else {
                        layer = lastLayer = parseInt(child.tagName.substr(1)) * 2; // Allow HR in between
                    }

                    tag = "div";
                } else if (child.matches("hr")) {
                    layer = lastLayer + 1; // hr crates subelement of the last element
                    tag = "div";
                }

                //console.log("layer is", layer, lastLayer, child.tagName, child);
                let e = this.createNewElement(child.tagName.toLowerCase(), layer, tag);


                e.setAttribute("style", child.getAttribute("style") || "");
                e.classList.add(...child.classList as any);
                child.setAttribute("orig-class", child.getAttribute("class") || "");
                child.setAttribute("class", "");
            }
            if (child.tagName === "HR") {
                child.setAttribute("orig-pre-split-class", child.getAttribute("class"));
                child.setAttribute("class", "d-none");
            }
            this.#currentContent.appendChild(child);
        });

        // Remove empty content elements
        Array.from(this.#target.querySelectorAll(".children")).forEach((child : HTMLElement) => {
            if (child.children.length === 0) {
                child.remove();
            }
        });

        // Reove empty content elements
        Array.from(this.#target.querySelectorAll(".content")).forEach((child : HTMLElement) => {
            if (child.children.length === 0) {
                child.remove();
            }
        });

        return this.#target;
    }
}
