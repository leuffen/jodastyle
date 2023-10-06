import {customElement, KaCustomElement, KaCustomWrapper, template} from "@kasimirjs/embed";
import {ka_session_storage} from "@kasimirjs/embed";

// language=HTML
const tpl = `
    <style>
        .sidepanel {
            position: fixed;
            top: 0;
            bottom: 0;
            right: 0;
            border: 0;
            width: 250px;
            z-index: 99999;
            transform: translateX(100%);
            transition: transform,box-shadow 0.3s ease-in-out;
            background: #000;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            padding: 5px;
        }
        
        .sidepanel .activator {
            position: absolute;
            z-index: 99999;
            top: 38vh;
            height: 50px;
            width: 50px;
            left: -50px;
            cursor: pointer;
            background: #000;
            color: #fff;
            border-radius: 10% 0 0 10%;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            opacity: 0.5;
            transition: opacity 0.3s ease-in-out;
        }
        .sidepanel.active .activator {
            opacity: 0.8;
            box-shadow: 0 0 20px rgba(0,0,0,07);
        }
        .sidepanel .activator:hover {
            opacity: 1;
        }
        .sidepanel.active {
            box-shadow: 0 0 20px rgba(0,0,0,0.7);
            transform: translateX(0);
        }
        .sidepanel .content {
            color: #fff;
        }
        
    </style>
    
    <nav class="sidepanel" ka.classlist.active="state.active">
        <div class="activator" ka.on.click="$fn.toggle()">B</div>
        <div class="content">
            <div  ka.content="$content"></div>
        </div>
    </nav>
`;


@template(tpl)
export class SwitcherElement extends KaCustomWrapper {

    constructor(config) {
        super();
        let state = ka_session_storage({active: false}, "switcher-element");
        let scope = this.init({
            state: state,
            $fn: {
                toggle: () => {
                    state.active = ! state.active;
                    scope.render();
                }
            },
            $on: {
                change: (e) => {
                    console.log("change", e);
                }
            }
        });
    }



}

@customElement("switcher-element")
@template("<b>Hello World</b>")
class SubElement extends KaCustomElement {
    static html;
    constructor() {
        super();
        this.wrap(new SwitcherElement({}));
    }
}

document.body.appendChild(new SubElement());
