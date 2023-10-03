import {JodaImageMetaData, JodaImageProcessorInterface} from "../processor/jodaimageproc";


export class LeuCDNImageProc implements JodaImageProcessorInterface {

    isSuitable(url: string): boolean {
        return url.startsWith("cdn") || url.startsWith("data:image,cdn");
    }

    parseUrl(url: string): JodaImageMetaData {
        let ret = {
            formats: [],
            resolutions: []
        } as JodaImageMetaData;
        url = url.replace("cdn+https://", "https://");
        url = url.replace("cdn://", "https://cdn.leuffen.de");
        url = url.replace(/\/(([0-9]+x[0-9]+|[,_])+)\//ig, (p0, sizes: string) => {
            sizes.split(/[,_]/g).forEach((size) => {
                ret.resolutions.push(
                    {
                        width: parseInt(size.split("x")[0]),
                        height: parseInt(size.split("x")[1])
                    }
                )
            });

            return "/@size@/";
        })

        ret.resolutions.sort((a, b) => {
            if (a.width < b.width)
                return -1;
            if (a.width > b.width)
                return 1;
            return 0;
        });

        url = url.replace(/([a-z0-9_\-]+)\.([a-z0-9\,_]+)$/ig, (p0, name, formats) => {
            //console.log("detect name", name, formats);
            ret.formats = formats.replace(/,/gm, "_").split("_");
            ret.filename = name;
            ret["__filename"] = name;
            ret.alt = name.replace(/_+/, " ");
            return "@file@";
        })

        ret.getUrl = (resolution, format) => {
            let loadUrl = url.replace(/@size@/g, resolution.width + "x" + resolution.height);
            loadUrl = loadUrl.replace(/@file@/g, ret.filename + "." + format);
            return loadUrl;
        };

        return ret;

    }

}
