//TODO: make frontendwewewewew


import express from "express";
import chalk from "chalk";
import {connect} from "./database.js";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import UrlShortenerRouter from "./components/url-shortner/router.js";
import AuthRouter from "./components/auth/router.js";
import { logger } from "./logger.js";
import { URI } from "./conn.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const VIEWS_FOLDER = path.join(path.dirname(__filename), "./views")


const app = express();

//middlewares
app.use(logger);
app.use("/public", express.static(path.join(__dirname,"./public")))


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