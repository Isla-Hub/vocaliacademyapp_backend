import { body, param } from "express-validator";

const createCommentValidation = [
  body("by")
    .notEmpty()
    .withMessage("The field by is required")
    .isMongoId()
    .withMessage("By field should be a valid MongoDB ID"),
  body("content")
    .notEmpty()
    .withMessage("The field content is required")
    .isString()
    .withMessage("Content field should be a string"),
];

const updateCommentValidation = [
  param("commentId")
    .notEmpty()
    .withMessage("Comment ID is required")
    .isMongoId()
    .withMessage("Comment ID should be a valid MongoDB ID"),
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content should be a string"),
];

export { createCommentValidation, updateCommentValidation };
