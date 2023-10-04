import express from "express";
import canPerformAction from "../middlewares/canPerformAction.js";
import { rolesAction } from "../rolesAction.js";
import { param } from "express-validator";
import {
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

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

import {
  createCommentValidation,
  updateCommentValidation,
} from "../middlewares/validations/commentValidations.js";

import handleValidationErrors from "../middlewares/validations/handleValidationErrors.js";

const router = express.Router();

router
  .route("/")
  .get(
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    getAllBookings
  )
  .post(
    createBookingValidation,
    handleValidationErrors,
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
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
    param("id").notEmpty().withMessage("Booking ID is required"),
    handleValidationErrors,
    getBookingById,
    (req, res) => {
      res.status(200).json(req.booking);
    }
  )
  .put(
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    updateBookingValidation,
    handleValidationErrors,
    updateBooking
  )
  .delete(
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    param("id").notEmpty().withMessage("Booking ID is required"),
    handleValidationErrors,
    deleteBooking
  );

router
  .route("/:id/comments")
  .post(
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    param("id").notEmpty().withMessage("Booking ID is required"),
    createCommentValidation,
    handleValidationErrors,
    getBookingById,
    createComment
  )
  .delete(
    canPerformAction([rolesAction.admin]),
    param("id").notEmpty().withMessage("Booking ID is required"),
    handleValidationErrors,
    getBookingById,
    deleteComment
  );

router
  .route("/:id/comments/:commentId")
  .put(
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    param("id").notEmpty().withMessage("Booking ID is required"),
    param("commentId").notEmpty().withMessage("Comment ID is required"),
    updateCommentValidation,
    handleValidationErrors,
    getBookingById,
    updateComment
  )
  .delete(
    canPerformAction([rolesAction.admin]),
    param("id").notEmpty().withMessage("Booking ID is required"),
    param("commentId").notEmpty().withMessage("Comment ID is required"),
    handleValidationErrors,
    getBookingById,
    deleteComment
  );

export default router;
