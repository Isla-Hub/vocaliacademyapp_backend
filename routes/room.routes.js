import express from "express";
import canPerformAction from "../middlewares/canPerformAction.js";
import { rolesAction } from "../rolesAction.js";
import {
  createRoomValidation,
  updateRoomValidation,
} from "../middlewares/validations/roomValidations.js";
import handleValidationErrors from "../middlewares/validations/handleValidationErrors.js";

import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller.js";

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
    getRoomById
  )
  .put(
    canPerformAction([rolesAction.admin]),
    updateRoomValidation,
    handleValidationErrors,
    updateRoom
  )
  .delete(canPerformAction([rolesAction.admin]), deleteRoom);

export default router;
