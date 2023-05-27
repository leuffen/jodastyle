

type Description = {
    category: "hero"|"element"|"section"|"footer",
    className: string,
    description: string,
    example : string,
    modifiers: Modifiers[]
}

type Modifiers = {
    className: string,
    description: string
}


export class __JodaDescriptionManager {

    public addClass(category: "hero"|"element"|"section"|"footer", className: string, description: string, example : string, modifiers: Modifiers[]) {
        if (window["jodastyle"] === undefined) {
            window["jodastyle"] = {};
        }
        if (window["jodastyle"]["descriptions"] === undefined) {
            window["jodastyle"]["descriptions"] = [];
        }
        window["jodastyle"]["descriptions"].push({category, className, description, example, modifiers});
    }


    get data() : Description[] {
        return window["jodastyle"]["descriptions"];
    }

    get classes() {
        return this.data.map(e => e.className);
    }

    public getDescription(className : string) : Description {
        return this.data.find(e => e.className === className);
    }

}

export const JodaDescriptionManager = new __JodaDescriptionManager();
