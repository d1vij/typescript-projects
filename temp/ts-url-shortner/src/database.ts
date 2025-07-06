import mongoose from "mongoose"
const NAMESERVER ="10.255.255.254"
let connected = false;
export async function connect(uri:string){
    if(connected) return mongoose.connection;
    try{
        await mongoose.connect(uri, {
            dbName: "link-shortner-app",
        })
        connected = true;
        return mongoose.connection;
    } catch(err){
        throw new Error("Unable to connect to mongodb server "+err);
    }
}