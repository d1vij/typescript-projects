import { Errors } from "../../errors.js"

export interface IURL {
    code:string,
    url:string
}
export interface IShortenedUrlResponse {
    code?: string,
    error_code?: Errors
}

export interface IGetUrlFromCodeResponse {
    url?: string,
    error_code?: Errors
}

export interface IRevokeUrlResponse{
    code_revoked?: string,
    url_revoked?: string,
    error_code?:Errors
}

export interface IGetAllCodesResponse