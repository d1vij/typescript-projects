import {Request, Response} from "express";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

import { IUser } from "../users/interfaces.js";
import UserCredDB, { IUserCredentialsDocument } from "../../models/user-credentials.js"
import { Errors } from "../../errors.js";
import { IUserDocument } from "../../models/user-data.js";
import { IAuthResponses } from "./interfaces.js";

export async function getLoginPage(_:Request, response:Response){
    response.render("login");
    return;
}

// POST /login
export async function processLogin(request:Request, response:Response){
    const {username, password} = request.body;
    const _document = await UserCredDB.findOne({username});
    if(!_document){
        response.json({error: Errors.USERNAME_NOT_FOUND, status: "error"} as IAuthResponses);
        return ;
    }

    const {user_id} = _document;
    request.session.user_id = user_id;
    response.json({ status: "success" } as IAuthResponses);
    
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

export async function createUser(request:Request, response:Response){
    const {username, password} = request.body;

    const _document = await UserCredDB.findOne({username});
    if(_document) {
        response.json({error: Errors.USERNAME_EXISTS});
        return;
    }

    const user_id = randomUUID();
    await UserCredDB.create({
        user_id,
        username,
        password: await bcrypt.hash(password, 10),
    })
    
    //session updation
    request.session.user_id = user_id;

    response.redirect("/home");
    return;
}