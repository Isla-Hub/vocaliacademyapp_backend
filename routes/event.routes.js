import express from "express";
import canPerformAction from "../middlewares/canPerformAction.js";
import { rolesAction } from "../rolesAction.js";
import { param } from "express-validator";

import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

import {
  createEventValidation,
  updateEventValidation,
} from "../middlewares/validations/eventValidations.js";

import handleValidationErrors from "../middlewares/validations/handleValidationErrors.js";

const router = express.Router();

router
  .route("/")
  .get(canPerformAction([
    rolesAction.admin,
    rolesAction.instructor,
    rolesAction.student,
  ]), getAllEvents)
  .post(canPerformAction([rolesAction.admin]), createEventValidation, handleValidationErrors, createEvent);
router
  .route("/:id")
  .get(
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    param("id").notEmpty().withMessage("Event ID is required"),
    handleValidationErrors,
    getEventById
  )
  .put(canPerformAction([rolesAction.admin]), updateEventValidation, handleValidationErrors, updateEvent)
  .delete(
    param("id").notEmpty().withMessage("Event ID is required"),
    handleValidationErrors,
    canPerformAction([rolesAction.admin])
    deleteEvent
  );

export default router;
