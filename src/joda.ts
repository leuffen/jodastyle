
type TemplateCallbacks = {

    /**
     * Called after the Template was connected (added to DOM)
     *
     * @param element   The root element of the template
     */
    onAfterConnectedCallback?: (element: HTMLElement) => void,


    /**
     * Called after all templates were connected (added to DOM) and initialized.
     * Use this Callback to add special functionality to your template
     *
     * @param element   The root element of the template
     */
    onAfterAllTemplatesConnectedCallback?: (element: HTMLElement) => void,
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
