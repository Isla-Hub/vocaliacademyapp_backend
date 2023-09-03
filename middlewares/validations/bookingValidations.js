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
  body("comments")
    .optional()
    .isArray({ min: 1 })
    .withMessage(
      "The comments field must be an array with at least one element."
    ),
  body("comments.*.by")
    .notEmpty()
    .withMessage("The by field is required for each element of comments.")
    .isString()
    .withMessage("The by field must be a string."),
  body("comments.*.date")
    .optional()
    .isISO8601()
    .withMessage("The date field must be a valid ISO8601 date.")
    .toDate(),
  body("comments.*.content")
    .notEmpty()
    .withMessage("The content field is required for each element of comments.")
    .isString()
    .withMessage("The content field must be a string."),
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
  body("comments")
    .optional()
    .notEmpty()
    .withMessage("The comments field cannot be empty.")
    .isArray({ min: 1 })
    .withMessage(
      "The comments field must be an array with at least one element."
    ),
  body("comments.*.by")
    .optional()
    .notEmpty()
    .withMessage("The by field cannot be empty for each element of comments.")
    .isString()
    .withMessage("The by field must be a string."),
  body("comments.*.date")
    .optional()
    .notEmpty()
    .withMessage("The date field cannot be empty for each element of comments.")
    .isISO8601()
    .withMessage("The date field must be a valid ISO8601 date.")
    .toDate(),
  body("comments.*.content")
    .optional()
    .notEmpty()
    .withMessage(
      "The content field cannot be empty for each element of comments."
    )
    .isString()
    .withMessage("The content field must be a string."),
];

export { createBookingValidation, updateBookingValidation };
