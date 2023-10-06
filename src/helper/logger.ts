
export class Logger {

    constructor(public name : string) {
    }
    log(...args : any[]) {
        console.log("[" + this.name + "]", ...args);
    }

    warn(...args : any[]) {
        console.warn("[" + this.name + "]", ...args);
    }
}
