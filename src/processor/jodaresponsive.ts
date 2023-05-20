import {Logger} from "../helper/logger";


export const breakpoints = {
    "xsm": 0,
    "sm": 576,
    "md": 768,
    "lg": 992,
    "xl": 1200,
    "xxl": 1400
}


export function getCurrentBreakpoint() : string {
    let ret = "";
    Object.keys(breakpoints).forEach((key) => {
        if (window.innerWidth >= breakpoints[key]) {
            ret = key;
        }
    });
    return ret;
}

class ResponsiveClass {
    always: string[] = [];
    default: string[] = null;
    xsm: null = null;
    xs: string[] = null;
    sm: string[] = null;
    md: string[] = null;
    lg: string[] = null;
    xl: string[] = null;
    xxl: string[] = null;

    breakpoints = ["xsm", "xs", "sm", "md", "lg", "xl", "xxl"];

    getClassesForBreakpoint(breakpoint : string = null) : string[] {
        if (breakpoint === null) {
            breakpoint = getCurrentBreakpoint();
        }


        let ret = [];
        ret.push(...this.always);
        let isDefault = true;
        for (let bp of this.breakpoints) {
            if (this[bp] !== null) {
                ret.push(...this[bp]);
                isDefault = false;
            }
            if (bp === breakpoint) {
                break;
            }
        }
        if (isDefault) {
            ret.push(...this.default);
        }
        ret = ret.filter((item) => item !== "");
        return ret;
    };
}

export function parseClassStr(input : string) : ResponsiveClass {
    let ret = new ResponsiveClass();
    let pointer = "always";
    input.split(" ").map((item) => {
        let matches = item.match(/\:([a-zA-Z]*)\:/);
        if (matches === null) {
            ret[pointer].push(item);
            return;
        }
        pointer = matches[1];
        if (pointer === "") {
            pointer = "default";
        }
        if (ret[pointer] === null) {
            ret[pointer] = [];
        }
    });
    return ret;
}


export class Jodaresponsive {


    constructor(public logger : Logger) {
    }

    private processNode(node : HTMLElement) {
        const origAttr = "data-class-orig";
        if ( ! node.hasAttribute(origAttr)) {
            let classes = node.getAttribute("class") ?? "";
            if (classes.indexOf(":") === -1)
                return;
            node.setAttribute(origAttr, classes);
        }
        let classes = node.getAttribute(origAttr);
        let responsiveClasses = parseClassStr(classes);

        node.setAttribute("class", "");
        node.classList.add(...responsiveClasses.getClassesForBreakpoint());

    }

    process(node : HTMLElement) {
        Array.from([node, ...node.querySelectorAll<HTMLElement>("*")]).forEach((child) => {
            this.processNode(child);
        });

    }


}
