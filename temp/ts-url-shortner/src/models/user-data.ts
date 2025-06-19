import mongoose, {Document, Schema, model} from "mongoose";
import { IUser } from "../components/users/interfaces.js";

export interface IUserDocument extends IUser, Document{};
const _userDataSchema = new Schema<IUserDocument>({
    user_id: {type:String, requried:true},
    owned_codes: [{type:String, requried:false}]
})

const _userDataModel = model<IUserDocument>("users-data", _userDataSchema);

export default _userDataModel;
