import express from "express";

import { login, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/").post(login);
router.route("/register").post(register);

export default router;
