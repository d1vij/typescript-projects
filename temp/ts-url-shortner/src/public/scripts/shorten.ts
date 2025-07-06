const mf = document.querySelector("form#mf") as HTMLFormElement;
const urlInput = document.querySelector("input#url") as HTMLInputElement;
mf.addEventListener("submit", async(event)=>{
    event.preventDefault();
    const url = encodeURI(urlInput.value);
    const response = await fetch(`/shorten/${url}`);
    const code = (await response.json()).code;
    console.log(code);
})