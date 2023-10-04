import { body, param } from "express-validator";

const createCommentValidation = [
  body("by")
    .notEmpty()
    .withMessage("The by field is required")
    .isMongoId()
    .withMessage("The by field should be a valid MongoDB ID"),
  body("content")
    .notEmpty()
    .withMessage("The content field is required")
    .isString()
    .withMessage("The content field should be a string"),
];

const updateCommentValidation = [
  param("commentId")
    .notEmpty()
    .withMessage("The commentId param is required")
    .isMongoId()
    .withMessage("The commentId param should be a valid MongoDB ID"),
  body("content")
    .notEmpty()
    .withMessage("The content field is required")
    .isString()
    .withMessage("The content field should be a string"),
];

export { createCommentValidation, updateCommentValidation };
