import { Errors } from "../../errors.js";

export interface IAuthResponses {
    error?: Errors,
    status?: "success" | "error"
}