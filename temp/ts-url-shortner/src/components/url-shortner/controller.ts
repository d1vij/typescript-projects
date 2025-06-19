import { Request, Response } from "express";
import { customAlphabet } from "nanoid";

import { IGetAllCodesResponse, IGetUrlFromCodeResponse, IRevokeUrlResponse, IShortenedUrlResponse, IURL } from "./interfaces.js";
import { Errors } from "../../errors.js";

import UrlDB from "../../models/urls.js";
import UserDataDB from "../../models/user-data.js";

const nanoid = customAlphabet("abcdefghijkmnopqrstuvwxyz123456789", 10);



// /shorten/:encodedUri
export async function shortenUrl(request: Request, response: Response): Promise<void> {
    const _code = nanoid();
    const { encodedUri } = request.params;
    const {user_id} = request.session;

    const _document = {
        code: _code,
        url: encodedUri
    } as IURL;
    await UrlDB.create(_document);

    const user_document = await UserDataDB.findOne({user_id}) || new UserDataDB({user_id, owned_codes:[]}) ;
    user_document.owned_codes.push(_code);
    await user_document.save();
    
    response.json({ code: _code } as IShortenedUrlResponse)
    return;
}

// /get-url/:code
export async function getUrl(request: Request, response: Response): Promise<void> {
    const {code} = request.params;
    const _document = await UrlDB.findOne({ code});

    if (!_document) {
        response.json({
            error_code: Errors.INVALID_URL_CODE,
        } as IGetUrlFromCodeResponse);
        return;
    };

    response.json({
        url: _document.url
    } as IGetUrlFromCodeResponse)
    return;
}

// /revoke/:code
export async function revokeUrl(request:Request, response:Response){
    const {code} = request.params;
    const _document = await UrlDB.findOne({code});
    if(!_document) {
        response.json(
            {error_code: Errors.INVALID_URL_CODE} as IRevokeUrlResponse
        );
        return;
    }
    //TODO: also remove from user which owns this code

    const url = _document.url;

    await _document.deleteOne();
    response.json({
        code_revoked: code,
        url_revoked: url
    } as IRevokeUrlResponse)

    return;
}

// GET /codes/:user_id
export async function getALlCodes(request:Request, response:Response){
    const {user_id} = request.params;
    const _document = await UserDataDB.findOne({user_id});

    response.json({
        found: _document?.owned_codes
    } as IGetAllCodesResponse)
}