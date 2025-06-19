import mongoose, {Document, Schema, model} from "mongoose";

export interface IUserCredentialsDocument extends Document{
    user_id: string,
    username: string,
    password: string
}

const _userCredSchema = new Schema<IUserCredentialsDocument>({
    user_id: {type:String, required:true, unique: true},
    username: {type:String, required:true},
    password: {type:String, required:true}
})

const _userCredModel = model<IUserCredentialsDocument>("user-credentials", _userCredSchema);

export default _userCredModel;