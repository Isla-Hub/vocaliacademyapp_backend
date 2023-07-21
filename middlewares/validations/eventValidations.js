import { body, param } from "express-validator";

const createEventValidation = [
  body("createdAt")
    .optional()
    .isISO8601()
    .withMessage("The createdAt field must be a valid ISO8601 date."),
  body("createdBy")
    .notEmpty()
    .withMessage("The createdBy field is required.")
    .isMongoId()
    .withMessage("The createdBy field must be a valid MongoDB ObjectId."),
  body("name")
    .notEmpty()
    .withMessage("The name field is required.")
    .isString()
    .withMessage("The name field must be a string."),
  body("date")
    .notEmpty()
    .withMessage("The date field is required.")
    .isISO8601()
    .withMessage("The date field must be a valid ISO8601 date.")
    .toDate(),
  body("instructedBy")
    .notEmpty()
    .withMessage("The instructedBy field is required.")
    .isMongoId()
    .withMessage("The instructedBy field must be a valid MongoDB ObjectId."),
  body("room")
    .notEmpty()
    .withMessage("The room field is required.")
    .isMongoId()
    .withMessage("The room field must be a valid MongoDB ObjectId."),
  body("eventGroupSize")
    .notEmpty()
    .withMessage("The eventGroupSize field is required.")
    .isInt({ min: 0 })
    .withMessage("The eventGroupSize field must be a positive integer."),
  body("totalAttended")
    .optional()
    .isInt({ min: 0 })
    .withMessage("The totalAttended field must be a positive integer."),
  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("The isPublic field must be a boolean value."),
  body("categories")
    .notEmpty()
    .withMessage("The categories field is required.")
    .isArray({ min: 1 })
    .withMessage(
      "The categories field must be an array with at least one element."
    )
    .isArray({ max: 10 })
    .withMessage("The categories field can have a maximum of 10 elements."),
  body("level")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage(
      "The level field must have one of the following values: beginner, intermediate, advanced."
    )
    .isString()
    .withMessage("The level field must be a string."),
  body("internalPrice")
    .notEmpty()
    .withMessage("The internalPrice field is required.")
    .isFloat({ min: 0 })
    .withMessage("The internalPrice field must be a positive number."),
  body("externalPrice")
    .notEmpty()
    .withMessage("The externalPrice field is required.")
    .isFloat({ min: 0 })
    .withMessage("The externalPrice field must be a positive number."),
  body("internalAtendants")
    .optional()
    .isArray()
    .withMessage("The internalAtendants field must be an array."),
  body("internalAtendants.*")
    .isMongoId()
    .withMessage(
      "Each element of internalAtendants must be a valid MongoDB ObjectId."
    ),
  body("externalAtendants")
    .optional()
    .isArray()
    .withMessage("The externalAtendants field must be an array."),
  body("externalAtendants.*.name")
    .notEmpty()
    .withMessage(
      "The name field is required for each element of externalAtendants."
    )
    .isString()
    .withMessage("The name field must be a string."),
  body("externalAtendants.*.lastName")
    .notEmpty()
    .withMessage(
      "The lastName field is required for each element of externalAtendants."
    )
    .isString()
    .withMessage("The lastName field must be a string."),
  body("externalAtendants.*.email")
    .notEmpty()
    .withMessage(
      "The email field is required for each element of externalAtendants."
    )
    .isEmail()
    .withMessage(
      "The email field must be a valid email address for each element of externalAtendants."
    ),
  body("externalAtendants.*.phoneNumber")
    .notEmpty()
    .withMessage(
      "The phoneNumber field is required for each element of externalAtendants."
    )
    .isString()
    .withMessage("The phoneNumber field must be a string."),
];

const updateEventValidation = [
  param("id")
    .notEmpty()
    .withMessage("Event ID is required")
    .isMongoId()
    .withMessage("The Event ID param must be a valid MongoDB ObjectId."),
  body("createdAt")
    .optional()
    .notEmpty()
    .isISO8601()
    .withMessage("The createdAt field must be a valid ISO8601 date."),
  body("createdBy")
    .optional()
    .notEmpty()
    .withMessage("The createdBy field is required.")
    .isMongoId()
    .withMessage("The createdBy field must be a valid MongoDB ObjectId."),
  body("name")
    .notEmpty()
    .withMessage("The name field is required.")
    .isString()
    .withMessage("The name field must be a string."),
  body("date")
    .optional()
    .notEmpty()
    .withMessage("The date field is required.")
    .isISO8601()
    .withMessage("The date field must be a valid ISO8601 date.")
    .toDate(),
  body("instructedBy")
    .optional()
    .notEmpty()
    .withMessage("The instructedBy field is required.")
    .isMongoId()
    .withMessage("The instructedBy field must be a valid MongoDB ObjectId."),
  body("room")
    .optional()
    .notEmpty()
    .withMessage("The room field is required.")
    .isMongoId()
    .withMessage("The room field must be a valid MongoDB ObjectId."),
  body("eventGroupSize")
    .optional()
    .notEmpty()
    .withMessage("The eventGroupSize field is required.")
    .isInt({ min: 0 })
    .withMessage("The eventGroupSize field must be a positive integer."),
  body("totalAttended")
    .optional()
    .notEmpty()
    .withMessage("The totalAttended field is required.")
    .isInt({ min: 0 })
    .withMessage("The totalAttended field must be a positive integer."),
  body("isPublic")
    .optional()
    .notEmpty()
    .withMessage("The isPublic field is required.")
    .isBoolean()
    .withMessage("The isPublic field must be a boolean value."),
  body("categories")
    .optional()
    .notEmpty()
    .withMessage("The categories field is required.")
    .isArray({ min: 1 })
    .withMessage(
      "The categories field must be an array with at least one element."
    )
    .isArray({ max: 10 })
    .withMessage("The categories field can have a maximum of 10 elements."),
  body("level")
    .optional()
    .notEmpty()
    .withMessage("The level field is required.")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage(
      "The level field must have one of the following values: beginner, intermediate, advanced."
    )
    .isString()
    .withMessage("The level field must be a string."),
  body("internalPrice")
    .optional()
    .notEmpty()
    .withMessage("The internalPrice field is required.")
    .isFloat({ min: 0 })
    .withMessage("The internalPrice field must be a positive number."),
  body("externalPrice")
    .optional()
    .notEmpty()
    .withMessage("The externalPrice field is required.")
    .isFloat({ min: 0 })
    .withMessage("The externalPrice field must be a positive number."),
  body("internalAtendants")
    .optional()
    .isArray()
    .withMessage("The internalAtendants field must be an array."),
  body("internalAtendants.*")
    .isMongoId()
    .withMessage(
      "Each element of internalAtendants must be a valid MongoDB ObjectId."
    ),
  body("externalAtendants")
    .optional()
    .isArray()
    .withMessage("The externalAtendants field must be an array."),
  body("externalAtendants.*.name")
    .notEmpty()
    .withMessage(
      "The name field is required for each element of externalAtendants."
    )
    .isString()
    .withMessage("The name field must be a string."),
  body("externalAtendants.*.lastName")
    .notEmpty()
    .withMessage(
      "The lastName field is required for each element of externalAtendants."
    )
    .isString()
    .withMessage("The lastName field must be a string."),
  body("externalAtendants.*.email")
    .notEmpty()
    .withMessage(
      "The email field is required for each element of externalAtendants."
    )
    .isEmail()
    .withMessage(
      "The email field must be a valid email address for each element of externalAtendants."
    ),
  body("externalAtendants.*.phoneNumber")
    .notEmpty()
    .withMessage(
      "The phoneNumber field is required for each element of externalAtendants."
    )
    .isString()
    .withMessage("The phoneNumber field must be a string."),
];

export { createEventValidation, updateEventValidation };
