import chalk from "chalk";
import { Image } from "image-js";

type TRed = number;
type TBlue = number;
type TGreen = number;
type TAlpha = number;

export type TPixelData = [TRed, TBlue, TGreen, TAlpha];

//@ts-ignore
function arrayAverage(arr: number[]): number {
    let len = arr.length;
    return arr.length !== 0 ? arraySum(arr) / len : 0;
}

export function arraySum(arr: number[]): number {
    return arr.reduce((a, b) => (a + b), 0);
}

export async function pixelateImage(_image: Image, gridSize: number): Promise<Image> {
    const { height, width, channels, data } = _image

    let _pixelatedImage = new Image({
        height: height,
        width: width,
        alpha: _image.alpha,
        bitDepth: _image.bitDepth
    });

    let _pixelatedImageData = _pixelatedImage.data;

    for (let y = 0; y < height; y += gridSize) {
        for (let x = 0; x < width; x += gridSize) {

            let redSum: number = 0;
            let greenSum: number = 0;
            let blueSum: number = 0;
            let alphaSum: number = 0;
            let sampleCount: number = 0;

            let redAvg: number = 0;
            let greenAvg: number = 0;
            let blueAvg: number = 0;
            let alphaAvg: number = 0;

            for (let dy = 0; dy < gridSize; dy++) {
                for (let dx = 0; dx < gridSize; dx++) {
                    let nextX = x + dx;
                    let nextY = y + dy

                    if (nextX < width && nextY < height) {
                        const index = (nextY * width + nextX) * channels;
                        if (channels === 4) {
                            redSum += data[index];
                            greenSum += data[index + 1];
                            blueSum += data[index + 2];
                            alphaSum += data[index + 3];
                        } else if (channels === 3) {
                            redSum += data[index];
                            greenSum += data[index + 1];
                            blueSum += data[index + 2];
                        } else if (channels === 2) { // Grey + Alpha
                            redSum += data[index];
                            greenSum += data[index]; // Green and Blue are same as Red for grey
                            blueSum += data[index];
                            alphaSum += data[index + 1];
                        } else if (channels === 1) { // Grey
                            redSum += data[index];
                            greenSum += data[index]; // Green and Blue are same as Red for grey
                            blueSum += data[index];
                        } else {
                            throw new Error("Insufficient Channels in image !");
                        }
                        sampleCount++;
                    }
                }
            }

            if (sampleCount > 0) {
                redAvg = Math.floor(redSum / sampleCount);
                greenAvg = Math.floor(greenSum / sampleCount);
                blueAvg = Math.floor(blueSum / sampleCount);
                alphaAvg = Math.floor(alphaSum / sampleCount);
            } else {
                // If no samples were taken (e.g., gridSize 0 or outside image)
                // Set to default or handle error appropriately.
                // Assuming transparent black if image has alpha, else opaque black.
                redAvg = 0;
                greenAvg = 0;
                blueAvg = 0;
                alphaAvg = _image.alpha ? 0 : 255;
            }

            for (let dy = 0; dy < gridSize; dy++) {
                for (let dx = 0; dx < gridSize; dx++) {
                    let nextX = x + dx;
                    let nextY = y + dy

                    if (nextX < width && nextY < height) {
                        const index = (nextY * width + nextX) * channels;
                        if (channels === 4) {
                            _pixelatedImageData[index] = redAvg;
                            _pixelatedImageData[index + 1] = greenAvg;
                            _pixelatedImageData[index + 2] = blueAvg;
                            _pixelatedImageData[index + 3] = alphaAvg;
                        } else if (channels === 3) {
                            _pixelatedImageData[index] = redAvg;
                            _pixelatedImageData[index + 1] = greenAvg;
                            _pixelatedImageData[index + 2] = blueAvg;
                        } else if (channels === 2) {
                            _pixelatedImageData[index] = redAvg;
                            _pixelatedImageData[index + 1] = alphaAvg; // Alpha channel for grey+alpha
                        } else if (channels === 1) {
                            _pixelatedImageData[index] = redAvg;
                        } else {
                            throw new Error("Insufficient Channels in image !");
                        }
                    }
                }
            }
        }
    }
    return _pixelatedImage;
}

// ----------------------------------------------------------------------------------------------------



export type TAsciiDensity = "LOW" | "HIGH" ;
type TAsciiReturn = "string" | "array"

interface IAsciiConfig {
    _image: Image,
    gridSize: number,
    density: TAsciiDensity,
    returnAs: TAsciiReturn
    pixelate?: boolean,
    color?: boolean
}

const DENSITIES = {
    LOW: " .:-=+*#%@",
    HIGH: " .\'\`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnumbowqLCJUYYXZO0QPDVEKGHBSA&EW#%$@"
}   

export async function convertToAscii(config: IAsciiConfig): Promise<string | string[][]> {

    let { _image, gridSize, density, returnAs, pixelate, color } = config;

    if (pixelate) _image = await pixelateImage(_image, gridSize);

    const _densityString = DENSITIES[density];
    const scaleFactor = (_densityString.length - 1) / 255


    let asciiArray: string[][] = [];

    const { width, height, data, channels } = _image;
    const pixelData = data;

    let stringIndex = 0;

    if (color) {
        let red = 0;
        let green = 0;
        let blue = 0;
        let avgBrightness = 0;

        for (let y = 0; y < height; y += gridSize) {
            let row: string[] = [];
            for (let x = 0; x < width; x += gridSize) {
                const dataIndex = (y * width + x) * channels;

                if (channels >= 3) {
                    red = pixelData[dataIndex];
                    green = pixelData[dataIndex + 1];
                    blue = pixelData[dataIndex + 2];
                } else if (channels === 1 || channels === 2) { // Grayscale or Grayscale + Alpha
                    red = pixelData[dataIndex];
                    green = pixelData[dataIndex];
                    blue = pixelData[dataIndex];
                } else {
                    console.warn(`Unsupported channels(${channels}) in color mode.Defaulting to black.`);
                    red = green = blue = 0;
                }

                avgBrightness = (red + green + blue) / 3;
                stringIndex = Math.floor(avgBrightness * scaleFactor);
                stringIndex = Math.max(0, Math.min(_densityString.length - 1, stringIndex));

                row.push(chalk.rgb(red, green, blue)(_densityString[stringIndex]));
            }
            asciiArray.push(row);
        }
    } else {
        _image = _image.grey();
        const { width, height, data } = _image;
        const greyPixelData = data;

        for (let y = 0; y < height; y += gridSize) {
            let row: string[] = [];
            for (let x = 0; x < width; x += gridSize) {
                // grey images only have one channel
                const dataIndex = (y * width + x);
                const value = greyPixelData[dataIndex];

                stringIndex = Math.floor(value * scaleFactor);
                row.push(_densityString[stringIndex]);
            }
            asciiArray.push(row);
        }
    }

    if (returnAs === "string") {
        let _outString = "";
        asciiArray.forEach(row => {
            _outString += row.join('');
            _outString += '\n';
        })
        return _outString;
    } else {
        return asciiArray;
    }
}
//----------------------------------------------------------------------------

interface IAsciiHTMLConfig {
    _image: Image,
    gridSize: number,
    density: "HIGH" | "LOW" | "custom" | string,
    customValue?: string,
    height?: number,
    width?: number
}


export async function convertToAsciiHTML(config:IAsciiHTMLConfig) {
    let { _image, gridSize, density,customValue } = config;

    let _densityString = ""
    if(density==="custom"){
        _densityString = customValue!; 
    }else {
        //@ts-ignore
        _densityString = DENSITIES[density]; 
    }
    const scaleFactor = (_densityString.length - 1) / 255

    let _outTextArray: string[][] = [];
    
    const { width, height, data, channels } = _image;
    const pixelData = data;

    let stringIndex = 0;

    let red = 0;
    let green = 0;
    let blue = 0;
    let avgBrightness = 0;

    for (let y = 0; y < height; y += gridSize) {
        let row: string[] = [];
        for (let x = 0; x < width; x += gridSize) {
            const dataIndex = (y * width + x) * channels;

            if (channels >= 3) {
                red = pixelData[dataIndex];
                green = pixelData[dataIndex + 1];
                blue = pixelData[dataIndex + 2];
            } else if (channels === 1 || channels === 2) { 
                red = pixelData[dataIndex];
                green = pixelData[dataIndex];
                blue = pixelData[dataIndex];
            } else {
                console.warn(`Unsupported channels(${channels}) in color mode.Defaulting to black.`);
                red = green = blue = 0;
            }

            avgBrightness = (red + green + blue) / 3;
            stringIndex = Math.floor(avgBrightness * scaleFactor);
            stringIndex = Math.max(0, Math.min(_densityString.length - 1, stringIndex));

            row.push(`<span style="color :rgb(${red}, ${green}, ${blue})">${_densityString[stringIndex]}</span>`);
        }
        _outTextArray.push(row);
    }
    
    
    let _outString = "<pre style='font-family: monospace; line-height: 1;'>\n";
    _outTextArray.forEach(row => {
        row.forEach(char => {
            _outString += char;
        })

        _outString += "<br>";
    })
    _outString += "</pre>";

    return _outString;
}