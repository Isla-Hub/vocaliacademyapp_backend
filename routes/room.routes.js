import express from "express";
import { params } from "express-validator";
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
  );
router
  .route("/")
  .post(
    canPerformAction([rolesAction.admin]),
    createRoomValidation,
    handleValidationErrors,
    createRoom
  );
router
  .route("/:id")
  .put(
    canPerformAction([rolesAction.admin]),
    updateRoomValidation,
    handleValidationErrors,
    updateRoom
  );
router.route("/:id").delete(canPerformAction([rolesAction.admin]), deleteRoom);

export default router;
