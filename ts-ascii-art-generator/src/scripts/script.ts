import {Image} from "image-js";
import {convertToAsciiHTML} from "./helpers.js";

const _outputDiv = document.querySelector<HTMLDivElement>("div#output");
const _gridSizeTextElm = document.querySelector<HTMLParagraphElement>("p#gridsizetxt")
const _gridSizeSliderElm = document.getElementById('gridsize') as HTMLInputElement;
const _custDensityInputElm = document.getElementById("custom-density") as HTMLInputElement;
const _heightInputElm = document.querySelector<HTMLInputElement>('input[name="height"]');
const _widthInputELm = document.querySelector<HTMLInputElement>('input[name="width"]');
const _imageSelectButton = document.querySelector<HTMLButtonElement>("button#select-image");
const _imageNameTextElm = document.querySelector<HTMLParagraphElement>("p#image-name");
const _generateButton = document.getElementById("generate") as HTMLButtonElement;
const _copyAsciiButton = document.getElementById("copy-ascii") as HTMLButtonElement;
const _copyHtmlButton = document.getElementById("copy-html") as HTMLButtonElement;

_imageSelectButton?.addEventListener('click', getImage);
_gridSizeSliderElm.addEventListener("input",changeGridSizeText);
_generateButton.addEventListener('click', generateAscii);
_copyAsciiButton.addEventListener('click', copyToClipboard);
_copyHtmlButton.addEventListener('click', copyToClipboard); 

let lastImage:Image;


async function changeGridSizeText(){
    _gridSizeTextElm!.textContent = `Sample Size ${_gridSizeSliderElm.value}`;
}



async function getImage(){
    _copyAsciiButton.hidden = true;
    _copyHtmlButton.hidden = true;
    
    const imagePicker = document.createElement("input") as HTMLInputElement;
    imagePicker.type = "file";
    imagePicker.accept = "image/png, image/jpeg";
    imagePicker.click();
    
    imagePicker.onchange = async function (){
        let data = imagePicker.files![0];
        if(data && ["image/png", "image/jpeg"].includes(data.type) ){
            _imageNameTextElm!.innerText = `Selected Image → ${data.name}`;
            lastImage = await Image.load(await data.arrayBuffer());
            
        } else {
            alert("Choose a valid image!");
        }
    }
}


async function generateAscii(){
    let _img = lastImage;
    _img = _img.resize({height:400, width:600});
    
    const gridSize = parseInt(_gridSizeSliderElm.value);
    const density = document.querySelector<HTMLButtonElement>("input[name='density']:checked")?.value || "HIGH";
    
    
    if(density==="custom"){
        _outputDiv!.innerHTML = await convertToAsciiHTML({
            _image:_img,
            density: "custom",
            gridSize:gridSize,
            customValue: _custDensityInputElm.value.toString(),
            resize_height: parseInt(_heightInputElm!.value),
            resize_width: parseInt(_widthInputELm!.value)
        })
    } else {
        _outputDiv!.innerHTML = await convertToAsciiHTML({
            _image: _img,
            density: density,
            gridSize: gridSize,
            resize_height: parseInt(_heightInputElm!.value),
            resize_width: parseInt(_widthInputELm!.value)
        })
    }

    _copyAsciiButton.hidden = false;
    _copyHtmlButton.hidden = false;
}

async function copyToClipboard(event:Event){
    let target = event.target as HTMLButtonElement;
    switch(target.getAttribute('id')){
        case("copy-ascii"):{
            await navigator.clipboard.writeText(_outputDiv!.innerText);
            alert("Copied ascii to clipboard");
            break;  
        }
        
        case("copy-html"):{
            await navigator.clipboard.writeText(_outputDiv!.innerHTML);
            alert("Copied html to clipboard");
            break;
        }
        default:{
            alert("?????????????");
        }
    }
}