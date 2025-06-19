import { Document, Schema, model } from "mongoose";
import { IURL } from "../components/url-shortner/interfaces.js";

export interface IURLDocument extends IURL, Document{};
const _urlSchema = new Schema<IURLDocument>({
    code:{type:String, requried:true, unique:true},
    url:{type:String, requried:true}
})

const _urlModel = model<IURLDocument>("urls",_urlSchema);
export default _urlModel;