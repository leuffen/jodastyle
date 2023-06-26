import {Logger} from "../helper/logger";


export class Jodashorts {

    constructor(public logger : Logger) {
    }


    process (source : string) : string {

        source = source.replace(/\[([a-z0-9\-)]+)(.*?)]/g, (match, name, attrStr) => {
            let attrs = {
                "class": []
            };

            // Search for name="value" or name='value'. Make sure that starting ' matches ending ' using back reference
            attrStr = attrStr.replaceAll("”", '"').replaceAll("“", '"').replaceAll("‘", "'").replaceAll("’", "'");
            attrStr = attrStr.replace(/([a-z0-9]+)=(["'])(.*?)\2/mig, (match, name, quote, value) => {
                console.log("match", match, name, quote, value);
                attrs[name] = value;
                return "";
            });

            attrStr.split(" ").forEach((attr) => {
                attr = attr.trim();
                if (attr === "")
                    return;
                if (attr.startsWith(".")) {
                    attrs["class"].push(attr.substr(1));
                }
                attrs["class"].push(attr);

            });

            console.log("attrs", attrs);
            let attrstr = "";
            for(let attr in attrs) {
                if (attr === "class") {
                    attrstr += ` class="${attrs[attr].join(" ")}"`
                } else {
                    attrstr += ` ${attr}="${attrs[attr]}"`
                }
            }

            let ret = `<${name}${attrstr}></${name}>`;
            return ret;

        });

        return source;
    }
}
