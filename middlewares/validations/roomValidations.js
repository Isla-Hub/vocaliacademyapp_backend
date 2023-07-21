import { body } from "express-validator";

const createRoomValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("createdBy").notEmpty().withMessage("Created By is required"),
  body("features").isArray().withMessage("Features must be an array"),
];

const updateRoomValidation = [
  body("name").optional().notEmpty().withMessage("Name is required"),
  body("createdBy").optional().notEmpty().withMessage("Created By is required"),
  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),
];

export { createRoomValidation, updateRoomValidation };
