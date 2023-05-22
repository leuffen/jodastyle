import {DefaultLayout} from "../types/DefaultLayout";


export interface JodaRendererInterface {


    render(element : HTMLElement, layout : DefaultLayout) : HTMLElement | Promise<HTMLElement>;
}
