import {Image} from "image-js";
import { convertToAscii } from "./helpers.js";


async function main() {
    
    let gs = 8
    
    let image = await Image.load("./content/spongebob.jpg");
    let asciistring = await convertToAscii({
        _image : image,
        density: "HIGH",
        gridSize: gs,
        returnAs: "string",
        color:true,
        pixelate: true
    })
    
    console.log(asciistring)

    console.log(`total pixels ${totalRenderedPixels(image, gs)}`);
}

function totalRenderedPixels(_image: Image, gridSize:number = 1): number{
    return (_image.height * _image.width) / (gridSize * gridSize);
}

main().catch(console.log);