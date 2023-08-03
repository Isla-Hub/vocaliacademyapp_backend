import express from "express";
import { param } from "express-validator";
import { rolesAction } from "../rolesAction.js";
import canPerformAction from "../middlewares/canPerformAction.js";
import { authenticateToken } from "../middlewares/jwt.js";

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
  .get(
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    getAllUsers
  )
  .post(
    canPerformAction([rolesAction.admin]),
    createUserValidation,
    handleValidationErrors,
    createUser
  );

router
  .route("/:id")
  .get(
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    param("id").notEmpty().withMessage("User ID is required"),
    handleValidationErrors,
    getUserById
  )
  .put(
    canPerformAction([rolesAction.admin]),
    updateUserValidation,
    handleValidationErrors,
    updateUser
  )
  .delete(
    canPerformAction([rolesAction.admin]),
    param("id").notEmpty().withMessage("User ID is required"),
    handleValidationErrors,
    deleteUser
  );

export default router;
