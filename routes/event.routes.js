import express from "express";
import canPerformAction from "../middlewares/canPerformAction.js";
import { rolesAction } from "../rolesAction.js";

import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router
  .route("/")
  .get(
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    getAllEvents
  );
router
  .route("/:id")
  .get(
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    getEventById
  );
router.route("/").post(canPerformAction([rolesAction.admin]), createEvent);
router.route("/:id").put(canPerformAction([rolesAction.admin]), updateEvent);
router.route("/:id").delete(canPerformAction([rolesAction.admin]), deleteEvent);

export default router;
