import express from "express";
import canPerformAction from "../middlewares/canPerformAction.js";
import { rolesAction } from "../rolesAction.js";

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
router.route("/").post(canPerformAction([rolesAction.admin]), createRoom);
router.route("/:id").put(canPerformAction([rolesAction.admin]), updateRoom);
router.route("/:id").delete(canPerformAction([rolesAction.admin]), deleteRoom);

export default router;
