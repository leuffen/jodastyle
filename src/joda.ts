
type TemplateCallbacks = {
    //onBeforeTemplateLoad?: (template: string, element: HTMLElement) => void,
}
type TemplateData = {
    template: string,
    layoutDefaults: {[key: string]: string|number|boolean}
    callbacks: TemplateCallbacks
}

export const Joda = new (class {

    /**
     * Register a template instead of adding <template id="...">...</template> to the DOM
     *
     * @param id
     * @param data
     * @param layoutDefaults
     * @param callbacks
     */
    public registerTemplate(id: string, data : string, layoutDefaults : {[key: string]: string|number|boolean} = {}, callbacks: TemplateCallbacks = {}) {
        if ( ! window["jodastyle"] )
            window["jodastyle"] = {};
        if ( ! window["jodastyle"]["templates"] )
            window["jodastyle"]["templates"] = {};

        window["jodastyle"]["templates"][id] = {
            template: data,
            layoutDefaults: layoutDefaults,
            callbacks: callbacks
        };
    }


    public getRegisteredTemplate(id: string) : TemplateData|null {
        if (id.startsWith("#"))
            id = id.substring(1);
        return window["jodastyle"]?.["templates"]?.[id] as TemplateData ?? null;
    }


})();
