import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";

import {URI} from "../../server.js"

const router = express.Router();


router.use(session({
    secret: "da90ff972d02c1294584eab20dde41e4ad7a6ede53b4e54c0e5236cde93a65bd",
    cookie:{
        maxAge: 3.6e+6
    },
    store: MongoStore.create({
        dbName: "link-shortner-app",
        collectionName: "session-data",
        mongoUrl: URI,
        ttl: 3.6e+6
    })
}))

// /login
router.get("/login",);
router.post("/login",);

// /logout
router.get("/logout", );

// /register
router.get("/register", );

export default router;