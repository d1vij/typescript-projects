import {Request, Response} from "express";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

import { IUser } from "../users/interfaces.js";
import UserCredDB from "../../models/user-credentials.js"
import UserDataDB from "../../models/user-data.js"
import { Errors } from "../../public/errors.js";
import { IUserDocument } from "../../models/user-data.js";
import { IAuthResponse} from "./interfaces.js";

export async function getLoginPage(_:Request, response:Response){
    response.render("login-register", {
        process: "login"
    });
    return;
}

// POST /login
export async function processLogin(request:Request, response:Response){
    const {username, password} = request.body;
    const _document = await UserCredDB.findOne({username});
    if(!_document){
        response.json({error_code: Errors.USERNAME_NOT_FOUND, status: "error"} as IAuthResponse);
        return ;
    }
    const pw_match = await bcrypt.compare(password,_document.password);
    if(!pw_match){
        response.json({status: "error", error_code:Errors.INCORRECT_PASSWORD} as IAuthResponse);
        return;
    }
    const {user_id} = _document;
    request.session.user_id = user_id;
    response.json({status:"success"} as IAuthResponse);
    return ;
}

// GET /logout
export async function clearSession(request:Request, response:Response){

    await new Promise((resolve, reject)=>{
        return request.session.destroy(err => {
            if (err) reject(err);
            else resolve(1);
        });
    })
    
    response.redirect(`${request.baseUrl}/login`); //redirects to /whatever-path-mounted-on/login
}

// GET /register

export async function getUserRegisterPage(request:Request, response:Response){
    response.render("login-register", {
        process: "register"
    })
    return;
}
export async function createUser(request:Request, response:Response){
    const {username, password} = request.body;

    const _document = await UserCredDB.findOne({username});
    if(_document!==null) {
        response.json({error: Errors.USERNAME_EXISTS, status:"error"} as IAuthResponse);
        return;
    }

    const user_id = randomUUID();
    await UserCredDB.create({
        user_id,
        username,
        password: await bcrypt.hash(password, 10),
    })
    await UserDataDB.create({
        user_id,
        owned_codes: []
    })
    //session updation
    request.session.user_id = user_id;
    response.json({status:"success"} as IAuthResponse)
    return;
}

export async function getThankyou(request:Request, response:Response){ 
    const {process, username} = request.query;
    response.render("thankyou",{
        process,
        username
    })
}