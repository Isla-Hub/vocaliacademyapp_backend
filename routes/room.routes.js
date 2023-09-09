import express from "express";
import canPerformAction from "../middlewares/canPerformAction.js";
import { rolesAction } from "../rolesAction.js";
import { param } from "express-validator";

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
    param("id").notEmpty().withMessage("Event ID is required"),
    handleValidationErrors,
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    getRoomById
  )
  .put(
    canPerformAction([rolesAction.admin]),
    updateRoomValidation,
    handleValidationErrors,
    updateRoom
  )
  .delete(
    param("id").notEmpty().withMessage("Event ID is required"),
    handleValidationErrors,
    canPerformAction([rolesAction.admin]),
    deleteRoom
  );

export default router;
