import {ka_session_storage} from "@kasimirjs/embed";






class JodaSiteConfig {

    public disable_split : boolean = false;
    public disable_templates : boolean = false;
    public disable_responsive : boolean = false;
    public debug_visualize : boolean = false;
    public debug_visualize_attribute : boolean = false; // Add Attribution to visualized elements
}


export const jodaSiteConfig : JodaSiteConfig = ka_session_storage(new JodaSiteConfig(), "jodaSiteConfig");

