import { body } from "express-validator";

const createRoomValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 50 })
    .withMessage("Name must be at most 50 characters long."),
  body("createdBy")
    .notEmpty()
    .withMessage("CreatedBy is required.")
    .isMongoId()
    .withMessage("CreatedBy must be a valid MongoDB ObjectId."),
  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array."),
];

const updateRoomValidation = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name cannot be empty.")
    .isLength({ max: 50 })
    .withMessage("Name must be at most 50 characters long"),
  body("createdBy").optional().notEmpty().withMessage("CreatedBy is required"),
  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array."),
];

export { createRoomValidation, updateRoomValidation };
