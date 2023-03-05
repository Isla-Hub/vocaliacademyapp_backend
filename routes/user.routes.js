import express from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById);
router.route("/").post(createUser);
router.route("/:id").put(updateUser);
router.route("/:id").delete(deleteUser);

export default router;
