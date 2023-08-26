import express from "express";
import canPerformAction from "../middlewares/canPerformAction.js";
import { rolesAction } from "../rolesAction.js";

import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.controller.js";

const router = express.Router();

router
  .route("/")
  .get(
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    getAllBookings
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
  );
router
  .route("/")
  .post(
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    createBooking
  );
router
  .route("/:id")
  .put(
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    updateBooking
  );
router
  .route("/:id")
  .delete(
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    deleteBooking
  );

export default router;
