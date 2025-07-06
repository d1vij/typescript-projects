import { IAuthResponse as IAuthResponse } from "../../components/auth/interfaces.js";
import { Errors } from "../errors.js";

const _form = document.querySelector("form#login") as HTMLFormElement;

_form.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const target = event.target as HTMLFormElement
    const formdata = new FormData(target);
    const data = Object.fromEntries(formdata.entries());
    
    const response = await fetch("/login",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    const res_json = await response.json() as IAuthResponse;
    if(res_json.status=="error"){
        target.reset();
        switch(res_json.error_code){
            case(Errors.USERNAME_NOT_FOUND):{
                alert("Username not found");
                break;
            }
            case(Errors.INCORRECT_PASSWORD):{
                alert("Incorrect password")
                break;
            }
        }
        return;
    }
    window.location.href = "/thankyou?process=login&username=" + formdata.get("username");
    return;
})