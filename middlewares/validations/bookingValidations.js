import { body } from "express-validator";
import { string } from "sharp/lib/is";

const createBookingValidation = [
  body("startTime")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("endTime")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("bookedBy")
    .notEmpty()
    .withMessage("BookedBy is required")
    .isMongoId()
    .withMessage("BookedBy must be a valid MongoDB ObjectId"),
  body("student")
    .notEmpty()
    .withMessage("Student is required")
    .isMongoId()
    .withMessage("Student must be a valid MongoDB ObjectId"),
  body("instructor")
    .notEmpty()
    .withMessage("Instructor is required")
    .isMongoId()
    .withMessage("Instructor must be a valid MongoDB ObjectId"),
  body("room")
    .notEmpty()
    .withMessage("Room is required")
    .isMongoId()
    .withMessage("Room must be a valid MongoDB ObjectId"),
  body("cancelled")
    .optional()
    .notEmpty()
    .withMessage("Cancelled cannot be empty")
    .isBoolean()
    .withMessage("Cancelled must be a boolean value"),
  body("comments")
    .optional()
    .notEmpty()
    .withMessage("Comments cannot be empty")
    .isArray({
      by: string,
      content: string,
      date: string,
    })
    .withMessage("Comments must be an array."),
];

const updateBookingValidation = [
  body("startTime")
    .optional()
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("endTime")
    .optional()
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("bookedBy")
    .optional()
    .notEmpty()
    .withMessage("BookedBy is required")
    .isMongoId()
    .withMessage("BookedBy must be a valid MongoDB ObjectId"),
  body("student")
    .optional()
    .notEmpty()
    .withMessage("Student is required")
    .isMongoId()
    .withMessage("Student must be a valid MongoDB ObjectId"),
  body("instructor")
    .optional()
    .notEmpty()
    .withMessage("Instructor is required")
    .isMongoId()
    .withMessage("Instructor must be a valid MongoDB ObjectId"),
  body("room")
    .optional()
    .notEmpty()
    .withMessage("Room is required")
    .isMongoId()
    .withMessage("Room must be a valid MongoDB ObjectId"),
  body("cancelled")
    .optional()
    .notEmpty()
    .withMessage("Cancelled cannot be empty")
    .isBoolean()
    .withMessage("Cancelled must be a boolean value"),
  body("comments")
    .optional()
    .notEmpty()
    .withMessage("Comments cannot be empty")
    .isArray({
      by: string,
      content: string,
      date: string,
    })
    .withMessage("Comments must be an array."),
];

export { createBookingValidation, updateBookingValidation };
