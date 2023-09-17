import express from "express";

import {
  login,
  refreshToken,
  rejectRefreshToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/refresh").post(refreshToken);
router.route("/rejectRefreshToken").post(rejectRefreshToken);

export default router;
