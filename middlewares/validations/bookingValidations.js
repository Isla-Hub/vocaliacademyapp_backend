import { body, param } from "express-validator";

const createBookingValidation = [
  body("createdAt")
    .optional()
    .isISO8601()
    .withMessage("The createdAt field must be a valid ISO8601 date.")
    .toDate(),
  body("startTime")
    .notEmpty()
    .withMessage("The startTime field is required.")
    .isISO8601()
    .withMessage("The startTime field must be a valid ISO8601 date.")
    .toDate(),
  body("endTime")
    .notEmpty()
    .withMessage("The endTime field is required.")
    .isISO8601()
    .withMessage("The endTime field must be a valid ISO8601 date.")
    .toDate(),
  body("bookedBy")
    .notEmpty()
    .withMessage("The bookedBy field is required.")
    .isMongoId()
    .withMessage("The bookedBy field must be a valid MongoDB ObjectId."),
  body("student")
    .notEmpty()
    .withMessage("The student field is required.")
    .isMongoId()
    .withMessage("The student field must be a valid MongoDB ObjectId."),
  body("instructor")
    .notEmpty()
    .withMessage("The instructor field is required.")
    .isMongoId()
    .withMessage("The instructor field must be a valid MongoDB ObjectId."),
  body("room")
    .notEmpty()
    .withMessage("The room field is required.")
    .isMongoId()
    .withMessage("The room field must be a valid MongoDB ObjectId."),
  body("cancelled")
    .optional()
    .isBoolean()
    .withMessage("The cancelled field must be a boolean value."),
];

const updateBookingValidation = [
  param("id")
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .withMessage("The Booking ID param must be a valid MongoDB ObjectId."),
  body("createdAt")
    .optional()
    .notEmpty()
    .withMessage("The createdAt field cannot be empty.")
    .isISO8601()
    .withMessage("The createdAt field must be a valid ISO8601 date.")
    .toDate(),
  body("startTime")
    .optional()
    .notEmpty()
    .withMessage("The startTime field cannot be empty.")
    .isISO8601()
    .withMessage("The startTime field must be a valid ISO8601 date.")
    .toDate(),
  body("endTime")
    .optional()
    .notEmpty()
    .withMessage("The endTime field cannot be empty.")
    .isISO8601()
    .withMessage("The endTime field must be a valid ISO8601 date.")
    .toDate(),
  body("bookedBy")
    .optional()
    .notEmpty()
    .withMessage("The bookedBy field cannot be empty.")
    .isMongoId()
    .withMessage("The bookedBy field must be a valid MongoDB ObjectId."),
  body("student")
    .optional()
    .notEmpty()
    .withMessage("The student field cannot be empty.")
    .isMongoId()
    .withMessage("The student field must be a valid MongoDB ObjectId."),
  body("instructor")
    .optional()
    .notEmpty()
    .withMessage("The instructor field cannot be empty.")
    .isMongoId()
    .withMessage("The instructor field must be a valid MongoDB ObjectId."),
  body("room")
    .optional()
    .notEmpty()
    .withMessage("The room field cannot be empty.")
    .isMongoId()
    .withMessage("The room field must be a valid MongoDB ObjectId."),
  body("cancelled")
    .optional()
    .notEmpty()
    .withMessage("The cancelled field cannot be empty.")
    .isBoolean()
    .withMessage("The cancelled field must be a boolean value."),
];

export { createBookingValidation, updateBookingValidation };
