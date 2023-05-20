const bestFormats = [
    "svg", "avif", "webp", "jpg", "jpeg", "png", "gif"
]
class MediaSupport {



    public avif : boolean = null
    public webp : boolean = null
    public jpg : boolean = true
    public jpeg : boolean = true
    public gif : boolean = true


    public valid : boolean = false;

    async detect() {
        this.webp = await testWebP() as any;
        this.avif = await testAvif() as any;
        console.log("Media supports", this);
        this.valid = true;
    }


    isSupported(extension : string) : boolean {
        extension = extension.trim().toLowerCase();
        if(typeof this[extension] === "undefined")
            return false;
        return this[extension];
    }

    getBestExtension (extensions : string[]) : string {
        for(let curExt of bestFormats) {
            if (typeof extensions.find(e => e === curExt) !== "undefined" && this.isSupported(curExt))
                return curExt;
        }
        return null;
    }

}

function testWebP() {
    return new Promise(res => {
        const webP = new Image();
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        webP.onload = webP.onerror = () => {
            res(webP.height === 2);
        };
    })
};


function testAvif() {
    return new Promise(res => {
        const webP = new Image();
        webP.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        webP.onload = webP.onerror = () => {
            res(webP.height === 2);
        };
    })
};


let promises : any[] = null;
let mediaSupport = new MediaSupport();

export async function getMediaSupport() : Promise<MediaSupport> {

    if (promises === null) {
        promises = [];
        await mediaSupport.detect();
        promises.forEach((exec) => exec(mediaSupport));
    }

    if (mediaSupport.valid === false) {
        return new Promise<MediaSupport>((resolve) => {
            promises.push(resolve);
        })
    }
    return mediaSupport;


}
