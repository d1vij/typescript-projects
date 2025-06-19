//TODO: make frontendwewewewew


import express from "express";
import chalk from "chalk";
import {connect} from "./database.js";

import UrlShortenerRouter from "./components/url-shortner/router.js";
import AuthRouter from "./components/auth/router.js";
import { logger } from "./logger.js";
import path from "path";

export const URI = "mongodb+srv://vermadivij:databasepassword@cluster1.lzjrylx.mongodb.net/"
const VIEWS_FOLDER = path.join(path.dirname(__filename), "./views")


const app = express();

//middlewares
app.use(logger);

//routers
app.use("/", AuthRouter);
app.use("/api", UrlShortenerRouter);

app.set("view engine", "ejs");
app.set("views",  VIEWS_FOLDER);

async function setup(){
    try{
        await connect(URI);
        console.log(chalk.green("Connected to server"));
        
    } catch(err){
        console.log(chalk.red("Unable to connect to database " + err));
    }

    app.listen(3000,()=>{
        console.log(chalk.green("Server running on http://localhost:3000/"))
    })
    
}

setup();