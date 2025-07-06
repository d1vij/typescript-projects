import { IAuthResponse } from "../../components/auth/interfaces.js";
import { Errors } from "../errors.js";

const _form = document.querySelector("form#register") as HTMLFormElement;

_form.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const target = event.target as HTMLFormElement
    const formdata = new FormData(target);
    const data = Object.fromEntries(formdata.entries());
    
    const response = await fetch("/register",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    const res_json = await response.json() as IAuthResponse;
    console.log(res_json)
    if(res_json.status=="error"){
        target.reset();
        switch(res_json.error_code){
            case(Errors.USERNAME_EXISTS):{
                alert("Username already exists!");
                break;
            }
        }
        return;
    }

    window.location.href = "/thankyou?process=register&username=" + formdata.get("username");
    return;
})