import {ka_create_element} from "@kasimirjs/embed";


export class Jodavisualize {

    public process(element : HTMLElement) {
        [element, ...Array.from(element.querySelectorAll("*"))].forEach((e : HTMLElement) => {
            e.insertBefore(ka_create_element("div", {class: "joda-visualize"}, `<${e.tagName.toLowerCase()}  class="${Array.from(e.classList).join(", ")}">`), e.firstElementChild);
        });
    }
}
