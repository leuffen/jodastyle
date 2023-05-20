import {DefaultLayout} from "../../../../src/core/DefaultLayout";

export interface JodaRendererInterface {


    render(element : HTMLElement, layout : DefaultLayout) : HTMLElement | Promise<HTMLElement>;
}
