import {LeuCDNImageProc} from "../vendor/LeuCDNImageProc";
import {getMediaSupport, MediaSupport} from "../helper/MediaSupport";
import {Logger} from "../helper/logger";

type Resolution = {
    width : number,
    height: number
}

export type JodaImageMetaData = {
    formats: string[],
    resolutions: Resolution[],
    filename: string,
    alt: string,
    [key : string] : any

    getUrl(resolution : Resolution, format : string) : string
}


export interface JodaImageProcessorInterface {
    isSuitable(url : string) : boolean;
    parseUrl(url : string) : JodaImageMetaData;
}



let imageIndex = 0;

export class JodaImageProc {

    constructor(private logger : Logger) {
    }

    private getBestResolution(data: Resolution[]): Resolution {
        data.sort((a, b) => {
            // sort by width ascending
            if (a.width < b.width)
                return -1;
            if (a.width > b.width)
                return 1;
            return 0;
        });

        let fit = data.find((e) => e.width >= window.innerWidth);
        if (typeof fit === "undefined")
            fit = data[data.length - 1];
        return fit ?? {width: 0, height: 0}
    }


    private getBestFormat(formats : string[], mediaSupport: MediaSupport) : string {
        return mediaSupport.getBestExtension(formats);

    }

    public async process(node : HTMLElement) {
        let processor = new LeuCDNImageProc();
        let mediaSupport = await getMediaSupport();
        for (let imgNode of node.querySelectorAll("img[src]")) {
            imageIndex++;
            let src = imgNode.getAttribute("src");
            imgNode.setAttribute("data-src-orig", src);

            if (processor.isSuitable(src)) {
                let data = processor.parseUrl(src);
                let bestFit = this.getBestResolution(data.resolutions);
                imgNode.setAttribute("width", bestFit.width.toString());
                imgNode.setAttribute("height", bestFit.height.toString());
                if (imgNode.getAttribute("alt") === null)
                    imgNode.setAttribute("alt", data.alt);
                imgNode.setAttribute("src", data.getUrl(bestFit, this.getBestFormat(data.formats, mediaSupport)));
            }

            if (imageIndex < 3) {
                imgNode.setAttribute("loading", "eager");
            } else {
                imgNode.setAttribute("loading", "lazy");
            }

        }






    }



}
