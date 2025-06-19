import express from "express";

import {shortenUrl, getUrl, revokeUrl, getALlCodes} from "./controller.js"
import { validateUserAuthentication } from "../auth/validator.js";


const router = express.Router();

router.use();

router.get("/shorten/:encodedUri",validateUserAuthentication, shortenUrl);
router.get("/get-url/:code",getUrl)
router.get("/revoke/:code",revokeUrl)

router.get("/codes/:user_id", validateUserAuthentication,  getALlCodes)

export default router;