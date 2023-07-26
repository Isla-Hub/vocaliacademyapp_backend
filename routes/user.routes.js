import express from "express";
import { param } from "express-validator";

import rolesAction from "../rolesAction";
import canPerformAction from "../middlewares/canPerformAction";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import {
  createUserValidation,
  updateUserValidation,
} from "../middlewares/validations/userValidations.js";

import handleValidationErrors from "../middlewares/validations/handleValidationErrors.js";

const router = express.Router();

router
  .route("/")
  .get(getAllUsers)
  .post(createUserValidation, handleValidationErrors, createUser);

router
  .route("/:id")
  .get(
    param("id").notEmpty().withMessage("User ID is required"),
    handleValidationErrors,
    getUserById
  )
  .put(updateUserValidation, handleValidationErrors, updateUser)
  .delete(
    param("id").notEmpty().withMessage("User ID is required"),
    handleValidationErrors,
    deleteUser
  );

export default router;
