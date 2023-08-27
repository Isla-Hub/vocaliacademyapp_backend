import express from "express";
import canPerformAction from "../middlewares/canPerformAction.js";
import { rolesAction } from "../rolesAction.js";
import { param } from "express-validator";

import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.controller.js";

import {
  createBookingValidation,
  updateBookingValidation,
} from "../middlewares/validations/bookingValidations.js";

import handleValidationErrors from "../middlewares/validations/handleValidationErrors.js";

const router = express.Router();

router
  .route("/")
  .get(
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    getAllBookings
  )
  .post(
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    createBookingValidation,
    handleValidationErrors,
    createBooking
  );
router
  .route("/:id")
  .get(
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    getBookingById
  )
  .put(
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    updateBookingValidation,
    handleValidationErrors,
    updateBooking
  )
  .delete(
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    deleteBooking
  );

export default router;
