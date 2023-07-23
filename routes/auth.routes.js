import express from "express";

import { login } from "../controllers/auth.controller.js";
import { createUser } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/login").post(login);


export default router;
