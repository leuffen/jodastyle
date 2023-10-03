

type Description = {
    category: "page"|"hero"|"element"|"section"|"footer",
    className: string,
    description: string,
    example : string,
    modifiers: Modifiers[]
    config: Config
}

interface Config  {
    bodyClasses?: string[];
    parseMarkdown?: boolean;
}

type Modifiers = {
    className: string,
    description: string
}


export class __JodaDescriptionManager {

    public addClass(category: "page"|"hero"|"element"|"section"|"footer", className: string, description: string, example : string, modifiers: Modifiers[], config: Config = {}) {
        let defaultConfig = {
            bodyClasses: [],
            parseMarkdown: true
        }
        config = {...defaultConfig, ...config};

        if (window["jodastyle"] === undefined) {
            window["jodastyle"] = {};
        }
        if (window["jodastyle"]["descriptions"] === undefined) {
            window["jodastyle"]["descriptions"] = [];
        }
        window["jodastyle"]["descriptions"].push({category, className, description, example, modifiers, config});
    }


    get data() : Description[] {
        if (window["jodastyle"] === undefined) {
            console.warn("[jodastyle description manager] No jodastyle descriptions found (Make sure you imported a theme) => window.jodastyle is undefined");
            return [];
        }

        return window["jodastyle"]["descriptions"] ?? [];
    }

    get classes() {
        return this.data.map(e => e.className);
    }

    public getDescription(className : string) : Description {
        return this.data.find(e => e.className === className);
    }

}

export const JodaDescriptionManager = new __JodaDescriptionManager();
