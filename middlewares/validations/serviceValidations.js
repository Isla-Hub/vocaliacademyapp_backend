import { body } from "express-validator";

const createServiceValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isString()
    .withMessage("The name field must be a string.")
    .isLength({ min: 5, max: 50 })
    .withMessage("The name filed must be between 5 and 50 characters."),
  body("createdBy")
    .notEmpty()
    .withMessage("CreatedBy is required.")
    .isMongoId()
    .withMessage("CreatedBy must be a valid MongoDB ObjectId."),
  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),
  body("sessionDuration")
    .notEmpty()
    .withMessage("SessionDuration is required.")
    .isInt({ min: 1 })
    .withMessage("SessionDuration must be a positive integer."),
  body("frequencyPerWeek")
    .notEmpty()
    .withMessage("FrequencyPerWeek is required.")
    .isInt({ min: 1 })
    .withMessage("FrequencyPerWeek must be a positive integer."),
  body("instructedBy")
    .notEmpty()
    .withMessage("InstructedBy is required.")
    .isMongoId()
    .withMessage("InstructedBy must be a valid MongoDB ObjectId."),
  body("groupSize")
    .notEmpty()
    .withMessage("GroupSize is required.")
    .isInt({ min: 1 })
    .withMessage("GroupSize must be a positive integer."),
];

const updateServiceValidation = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name cannot be empty.")
    .isString()
    .withMessage("The name field must be a string.")
    .isLength({ min: 5, max: 50 })
    .withMessage("The name filed must be between 5 and 50 characters."),
  body("createdBy")
    .optional()
    .notEmpty()
    .withMessage("CreatedBy cannot be empty.")
    .isMongoId()
    .withMessage("CreatedBy must be a valid MongoDB ObjectId."),
  body("price")
    .optional()
    .notEmpty()
    .withMessage("Price cannot be empty.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),
  body("sessionDuration")
    .optional()
    .notEmpty()
    .withMessage("SessionDuration cannot be empty.")
    .isInt({ min: 1 })
    .withMessage("SessionDuration must be a positive integer."),
  body("frequencyPerWeek")
    .optional()
    .notEmpty()
    .withMessage("FrequencyPerWeek cannot be empty.")
    .isInt({ min: 1 })
    .withMessage("FrequencyPerWeek must be a positive integer."),
  body("instructedBy")
    .optional()
    .notEmpty()
    .withMessage("InstructedBy cannot be empty.")
    .isMongoId()
    .withMessage("InstructedBy must be a valid MongoDB ObjectId."),
  body("groupSize")
    .optional()
    .notEmpty()
    .withMessage("GroupSize cannot be empty.")
    .isInt({ min: 1 })
    .withMessage("GroupSize must be a positive integer."),
];

export { createServiceValidation, updateServiceValidation };
