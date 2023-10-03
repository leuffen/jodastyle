import {ka_create_element} from "@kasimirjs/embed";


export function parseVariableAndStyleStr (varString : string) : any {
    let attrs : any = {"$": {}, "@": {}};
    let regex = new RegExp(`([@$])[^@^$]+`, "gi")
    varString.replace(regex, (match: string, type: string) => {
        match = match.substring(1);
        if (match.indexOf("=") === -1 && type === "@" ) {
            if (typeof attrs[type].class === "undefined")
                attrs[type].class = "";
            attrs[type].class += " " + match;
            attrs[type].class = attrs[type].class.trim();
        } else {
            let res = match.split("=");
            attrs[type][res.shift()] = res.join("=").trim();
        }
        return "";
    })
    return attrs;
}

export function parseVariableStr (varString : string, delimiter = "@") : any {
    let attrs : any = {};
    let regex = new RegExp(`\\${delimiter}[^${delimiter}]+`, "gi")
    varString.replace(regex, (match: string) => {
        match = match.substring(1);
        if (match.indexOf("=") === -1) {
            if (typeof attrs.class === "undefined")
                attrs.class = "";
            attrs.class += " " + match;
            attrs.class = attrs.class.trim();
        } else {
            let res = match.split("=");

            attrs[res.shift()] = res.join("=").trim();
        }
        return "";
    })
    return attrs;
}

export function parseAttributeStr(attrString : string ) : any {
    return parseVariableStr(attrString, "@")
}

export function createElement(definition : string) : HTMLElement {
    let defRest = definition.trim();
    let tag = "div";
    defRest = defRest.replace(/^[a-z0-9_\:\-]+/ig, (match: string) => {
        tag = match;
        return "";
    })
    let attrs = parseAttributeStr(defRest);


    let element = ka_create_element(tag, attrs);
    return element;
}

export function createElementTree (def : string) : {start: HTMLElement, leaf: HTMLElement} {

    let start : HTMLElement = null;
    let leaf : HTMLElement = null;



    let splitted = def.split(">");
    while(splitted.length > 0) {
        let cur = splitted.shift();

        let refName = null;
        cur = cur.replace(/§([a-z0-9_\-]+)/, (a, name) => {
            refName = name;
            return "";
        });


        if (cur.trim().startsWith("|")) {
            // TextNode
            let el = document.createElement("div");
            if (splitted.length > 0)
                cur += ">" + splitted.join(">");

            el.innerHTML = cur.trim().substring(1);
            el.childNodes.forEach((e) => leaf.append(e.cloneNode(true)));
            el.remove();
            break;
        }

        let el = createElement(cur);

        /*if (refName !== null)
            this.#refs[refName] = el;
*/
        if (start === null) {
            start = leaf = el;
        } else {
            if (leaf instanceof HTMLTemplateElement) {
                leaf.content.appendChild(el);
            } else {
                leaf.appendChild(el);

            }
            leaf = el;
        }
    }
    return {start, leaf};
}
