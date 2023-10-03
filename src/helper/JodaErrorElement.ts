import {customElement, KaCustomElement, template} from "@kasimirjs/embed";


let tpl = `
<style>
.joda-error {
    display: block;
    background-color: rgba(241,179,179,0.17);
    margin: 1em;
    padding: 1em;
    color: red;
    font-weight: bold;
    border: 3px solid red;
}
</style>
<div class="joda-error">
    [[ message ]]
</div>
`;

@customElement('joda-error')
@template(tpl)
export class JodaErrorElement extends KaCustomElement {
    constructor(public message) {
        super();
        let scope = this.init({
            message: message
        });
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.scope.message = this.message;

    }
}
