import { body, param } from "express-validator";

const createRoomValidation = [
  body("name")
    .notEmpty()
    .withMessage("The name field is required.")
    .isString()
    .withMessage("The name field must be a string.")
    .isLength({ min: 5, max: 50 })
    .withMessage("The name field must be between 5 and 50 characters."),
  body("createdBy")
    .notEmpty()
    .withMessage("The createdBy field is required.")
    .isMongoId()
    .withMessage("The createdBy field must be a valid MongoDB ObjectId."),
  body("features")
    .optional()
    .isArray()
    .withMessage("The features field must be an array."),
];

const updateRoomValidation = [
  param("id")
    .notEmpty()
    .withMessage("Room ID is required")
    .isMongoId()
    .withMessage("The Romm ID param must be a valid MongoDB ObjectId."),
  body("name")
    .optional()
    .notEmpty()
    .withMessage("The name field cannot be empty.")
    .isString()
    .withMessage("The name field must be a string.")
    .isLength({ min: 5, max: 50 })
    .withMessage("The name field must be between 5 and 50 characters."),
  body("createdBy")
    .optional()
    .notEmpty()
    .withMessage("The createdBy field cannot be empty.")
    .isMongoId()
    .withMessage("The createdBy field must be a valid MongoDB ObjectId."),
  body("features")
    .optional()
    .notEmpty()
    .withMessage("The features field cannot be empty.")
    .isArray()
    .withMessage("The features field must be an array."),
  body("createdAt")
    .optional()
    .notEmpty()
    .withMessage("The createdAt field cannot be empty.")
    .isISO8601()
    .withMessage("The createdAt field must be a valid ISO8601 date.")
    .isDate(),
];

export { createRoomValidation, updateRoomValidation };
