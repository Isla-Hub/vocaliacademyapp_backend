import express from "express";
import { param } from "express-validator";
import { rolesAction } from "../rolesAction.js";
import canPerformAction from "../middlewares/canPerformAction.js";

import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller.js";

import {
  createRoomValidation,
  updateRoomValidation,
} from "../middlewares/validations/roomValidations.js";
import handleValidationErrors from "../middlewares/validations/handleValidationErrors.js";

const router = express.Router();

router
  .route("/")
  .get(
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    getAllRooms
  )
  .post(
    canPerformAction([rolesAction.admin]),
    createRoomValidation,
    handleValidationErrors,
    createRoom
  );

router
  .route("/:id")
  .get(
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    param("id").notEmpty().withMessage("User ID is required"),
    handleValidationErrors,
    getRoomById
  )
  .put(
    canPerformAction([rolesAction.admin]),
    param("id").notEmpty().withMessage("User ID is required"),
    updateRoomValidation,
    handleValidationErrors,
    updateRoom
  )
  .delete(
    canPerformAction([rolesAction.admin]),
    param("id").notEmpty().withMessage("User ID is required"),
    handleValidationErrors,
    deleteRoom
  );

export default router;
