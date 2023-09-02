import { body, param } from "express-validator";

const createPaymentValidation = [
  body("paidBy")
    .notEmpty()
    .withMessage("The paidBy field is required.")
    .isMongoId()
    .withMessage("The paidBy field must be a valid MongoDB ObjectId."),
  body("paidAt")
    .optional()
    .isISO8601()
    .withMessage("The createdAt field must be a valid ISO8601 date.")
    .toDate(),
  body("product")
    .notEmpty()
    .withMessage("The product field is required.")
    .isMongoId()
    .withMessage("The product field must be a valid MongoDB ObjectId."),
  body("productModel")
    .notEmpty()
    .withMessage("The productModel field is required.")
    .isIn(["Service", "Event"])
    .withMessage('The productModel field must be "Service" or "Event".'),
  body("createdBy")
    .notEmpty()
    .withMessage("The createdBy field is required.")
    .isMongoId()
    .withMessage("The createdBy field must be a valid MongoDB ObjectId."),
  body("createdAt")
    .optional()
    .isISO8601()
    .withMessage("The createdAt field must be a valid ISO8601 date."),
];

const updatePaymentValidation = [
  param("id")
    .notEmpty()
    .withMessage("Event ID is required")
    .isMongoId()
    .withMessage("The Event ID param must be a valid MongoDB ObjectId."),
  body("paidBy")
    .optional()
    .notEmpty()
    .isMongoId()
    .withMessage("The paidBy field must be a valid MongoDB ObjectId."),
  body("paidAt")
    .optional()
    .notEmpty()
    .isISO8601()
    .withMessage("The paidAt field must be a valid ISO8601 date."),
  body("product")
    .optional()
    .notEmpty()
    .isMongoId()
    .withMessage("The product field must be a valid MongoDB ObjectId."),
  body("productModel")
    .optional()
    .notEmpty()
    .isIn(["Service", "Event"])
    .withMessage('The productModel field must be "Service" or "Event".'),
  body("createdBy")
    .optional()
    .notEmpty()
    .isMongoId()
    .withMessage("The createdBy field must be a valid MongoDB ObjectId."),
  body("createdAt")
    .optional()
    .notEmpty()
    .isISO8601()
    .withMessage("The createdAt field must be a valid ISO8601 date."),
];

export { createPaymentValidation, updatePaymentValidation };
