
export const Joda = new (class {

    /**
     * Register a template instead of adding <template id="...">...</template> to the DOM
     *
     * @param id
     * @param data
     */
    public registerTemplate(id: string, data : string) {
        if ( ! window["jodastyle"] )
            window["jodastyle"] = {};
        if ( ! window["jodastyle"]["templates"] )
            window["jodastyle"]["templates"] = {};

        window["jodastyle"]["templates"][id] = data;
    }


    public getRegisteredTemplate(id: string) : string|null {
        if (id.startsWith("#"))
            id = id.substring(1);
        return window["jodastyle"]?.["templates"]?.[id] ?? null;
    }


})();
