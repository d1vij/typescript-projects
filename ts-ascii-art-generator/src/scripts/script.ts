import {Image} from "image-js";
import {convertToAsciiHTML} from "./helpers.js";

const _outLoc = document.querySelector<HTMLDivElement>("div#output");
const _formElm = document.querySelector<HTMLFormElement>("form#cuteform");
const _gst = document.querySelector<HTMLParagraphElement>("p#gridsizetxt")
const _gsslider = document.getElementById('gridsize') as HTMLInputElement;
const _custDensity = document.getElementById("custom-density") as HTMLInputElement;
const _height = document.querySelector<HTMLInputElement>('input[name="height"]');
const _width = document.querySelector<HTMLInputElement>('input[name="width"]');

_formElm?.addEventListener("submit", generateAscii)

_gsslider?.addEventListener('change', ()=>{
    _gst!.textContent = _gsslider.value;
})


async function generateAscii(event: Event) {
    event.preventDefault();
    event.preventDefault();

    const formData = new FormData((event.target! as HTMLFormElement));
    const _imageFile = formData.get("photoinput") as File ;
    console.warn("File found ", _imageFile);

    const gridSize = parseInt(formData.get("gridsize")!.toString());
    const density = formData.get("density")?.toString()!;

    const arrayBuff = await _imageFile.arrayBuffer();
    let _img = await Image.load(arrayBuff);

    _img = _img.resize({height:400, width:600});

    let asciiHtml: string = "";

    
    if(density==="custom"){
        asciiHtml = await convertToAsciiHTML({
            _image:_img,
            density: "custom",
            gridSize:gridSize,
            customValue: _custDensity.value.toString(),
            height: parseInt(_height!.value),
            width: parseInt(_width!.value)
        })
    } else {
        asciiHtml = await convertToAsciiHTML({
            _image: _img,
            density: density,
            gridSize: gridSize,
            height: parseInt(_height!.value),
            width: parseInt(_width!.value)
        })
    }
    _outLoc!.innerHTML = asciiHtml;
}





