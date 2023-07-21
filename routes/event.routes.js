import express from "express";
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
  .get(getAllEvents)
  .post(createEventValidation, handleValidationErrors, createEvent);
router
  .route("/:id")
  .get(
    param("id").notEmpty().withMessage("Event ID is required"),
    handleValidationErrors,
    getEventById
  )
  .put(updateEventValidation, handleValidationErrors, updateEvent)
  .delete(
    param("id").notEmpty().withMessage("Event ID is required"),
    handleValidationErrors,
    deleteEvent
  );

export default router;
