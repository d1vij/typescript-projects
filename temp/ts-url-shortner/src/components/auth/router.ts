import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";

import {URI} from "../../conn.js"
import { clearSession, createUser, getThankyou, getLoginPage as getUserLoginPage, getUserRegisterPage, processLogin } from "./controller.js";

const router = express.Router();

router.use(express.json());
router.use(session({
    secret: "da90ff972d02c1294584eab20dde41e4ad7a6ede53b4e54c0e5236cde93a65bd",
    saveUninitialized: false,
    resave:false,
    cookie:{
        maxAge: 3.6e+6,
        
    },
    store: MongoStore.create({
        dbName: "link-shortner-app",
        collectionName: "session-data",
        mongoUrl: URI,
        ttl: 3.6e+6
    })
}))

// /login
router.get("/login", getUserLoginPage);
router.post("/login", processLogin);

// /logout
router.get("/logout", clearSession);

// /register
router.get("/register", getUserRegisterPage);
router.post("/register", createUser);

// /thankyou
router.get("/thankyou", getThankyou);

export default router;