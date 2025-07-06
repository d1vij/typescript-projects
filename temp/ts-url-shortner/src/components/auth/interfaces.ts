import { Errors } from "../../public/errors.js";

export interface IAuthResponse {
    error_code?: Errors,
    status?: "success" | "error"
}