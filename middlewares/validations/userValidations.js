import { body } from "express-validator";

const createUserValidation = [
  body("name")
    .notEmpty()
    .withMessage("The name field is required.")
    .isString()
    .withMessage("The name field must be a string.")
    .isLength({ min: 5, max: 50 })
    .withMessage("The name field must be between 5 and 50 characters."),
  body("lastName")
    .notEmpty()
    .withMessage("The Last Name field is required.")
    .isString()
    .withMessage("The Last Name field must be a string.")
    .isLength({ min: 5, max: 50 })
    .withMessage("The Last Name field must be between 5 and 50 characters."),
  body("email")
    .notEmpty()
    .withMessage("The email field is required.")
    .isEmail()
    .withMessage("Invalid email."),
  body("phoneNumber")
    .notEmpty()
    .withMessage("The Phone number field is required."),
  body("avatar").optional().isURL().withMessage("Invalid avatar URL."),
  body("dateOfBirth")
    .notEmpty()
    .withMessage("The date of birth field is required.")
    .isISO8601()
    .withMessage("Invalid date format."),
  body("role")
    .optional()
    .isIn(["student", "instructor", "admin"])
    .withMessage("Invalid role."),
  body("password")
    .notEmpty()
    .withMessage("The password field is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("subscribed.newsletter")
    .optional()
    .isBoolean()
    .withMessage("Newsletter subscription must be a boolean value."),
  body("subscribed.notifications")
    .optional()
    .isBoolean()
    .withMessage("Notifications subscription must be a boolean value."),
];

const updateUserValidation = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("The name field is required.")
    .isString()
    .withMessage("The name field must be a string.")
    .isLength({ min: 5, max: 50 })
    .withMessage("The name field must be between 5 and 50 characters."),
  body("lastName")
    .optional()
    .notEmpty()
    .withMessage("The Last Name field is required.")
    .isString()
    .withMessage("The Last Name field must be a string.")
    .isLength({ min: 5, max: 50 })
    .withMessage("The Last Name field must be between 5 and 50 characters."),
  body("email")
    .optional()
    .notEmpty()
    .withMessage("The email field is required.")
    .isEmail()
    .withMessage("Invalid email."),
  body("phoneNumber")
    .optional()
    .notEmpty()
    .withMessage("The phone number field is required."),
  body("avatar").optional().isURL().withMessage("Invalid avatar URL."),
  body("dateOfBirth")
    .optional()
    .notEmpty()
    .withMessage("The date of birth field is required.")
    .isISO8601()
    .withMessage("Invalid date format."),
  body("role")
    .optional()
    .isIn(["student", "instructor", "admin"])
    .withMessage("Invalid role."),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("subscribed.newsletter")
    .optional()
    .isBoolean()
    .withMessage("Newsletter subscription must be a boolean value."),
  body("subscribed.notifications")
    .optional()
    .isBoolean()
    .withMessage("Notifications subscription must be a boolean value."),
];

export { createUserValidation, updateUserValidation };
