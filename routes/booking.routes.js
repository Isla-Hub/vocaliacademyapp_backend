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
    param("id").notEmpty().withMessage("Booking ID is required"),
    handleValidationErrors,
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    getBookingById,
    (req, res) => {
      res.status(200).json(req.booking);
    }
  )
  .put(
    updateBookingValidation,
    handleValidationErrors,
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    updateBooking
  )
  .delete(
    param("id").notEmpty().withMessage("Booking ID is required"),
    handleValidationErrors,
    canPerformAction([rolesAction.admin, rolesAction.instructor]),
    deleteBooking
  );

router
  .route("/:id/comments")
  .post(
    param("id").notEmpty().withMessage("Booking ID is required"),
    createCommentValidation,
    handleValidationErrors,
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    getBookingById,
    createComment
  )
  .delete(
    param("id").notEmpty().withMessage("Booking ID is required"),
    handleValidationErrors,
    canPerformAction([rolesAction.admin]),
    getBookingById,
    deleteComment
  );

router
  .route("/:id/comments/:commentId")
  .put(
    param("id").notEmpty().withMessage("Booking ID is required"),
    param("commentId").notEmpty().withMessage("Comment ID is required"),
    updateCommentValidation,
    handleValidationErrors,
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    getBookingById,
    updateComment
  )
  .delete(
    param("id").notEmpty().withMessage("Booking ID is required"),
    param("commentId").notEmpty().withMessage("Comment ID is required"),
    handleValidationErrors,
    canPerformAction([rolesAction.admin]),
    getBookingById,
    deleteComment
  );

export default router;
