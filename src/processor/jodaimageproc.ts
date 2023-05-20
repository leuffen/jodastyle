


export class JodaImageProc {


    public async process(node : HTMLElement) {
        let images = node.querySelectorAll("img");
        for (let image of Array.from(images)) {
            let src = image.getAttribute("src");
            if (src === null) {
                continue;
            }
            if (src.startsWith("data:image")) {
                continue;
            }
            let img = new Image();
            img.src = src;
            await new Promise((resolve) => {
                img.onload = () => {
                    image.setAttribute("width", img.width.toString());
                    image.setAttribute("height", img.height.toString());
                    resolve();
                };
            });
        }
    }

}
