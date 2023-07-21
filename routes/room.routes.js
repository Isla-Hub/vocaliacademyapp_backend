import express from "express";
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
  .get(getAllRooms)
  .post(createRoomValidation, handleValidationErrors, createRoom);
router
  .route("/:id")
  .get(
    param("id").notEmpty().withMessage("Id is required"),
    handleValidationErrors,
    getRoomById
  )
  .put(updateRoomValidation, handleValidationErrors, updateRoom)
  .delete(
    param("id").notEmpty().withMessage("Id is required"),
    handleValidationErrors,
    deleteRoom
  );

export default router;
