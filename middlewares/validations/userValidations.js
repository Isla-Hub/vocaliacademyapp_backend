import { body } from "express-validator";

const createUserValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("lastName").notEmpty().withMessage("Last Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  body("avatar").optional().isURL().withMessage("Invalid avatar URL"),
  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("role")
    .optional()
    .isIn(["student", "instructor", "admin"])
    .withMessage("Invalid role"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("subscribed.newsletter")
    .optional()
    .isBoolean()
    .withMessage("Newsletter subscription must be a boolean value"),
  body("subscribed.notifications")
    .optional()
    .isBoolean()
    .withMessage("Notifications subscription must be a boolean value"),
];

const updateUserValidation = [
  body("name").optional().notEmpty().withMessage("Name is required"),
  body("lastName").optional().notEmpty().withMessage("Last Name is required"),
  body("email")
    .optional()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("phoneNumber")
    .optional()
    .notEmpty()
    .withMessage("Phone number is required"),
  body("avatar").optional().isURL().withMessage("Invalid avatar URL"),
  body("dateOfBirth")
    .optional()
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("role")
    .optional()
    .isIn(["student", "instructor", "admin"])
    .withMessage("Invalid role"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("subscribed.newsletter")
    .optional()
    .isBoolean()
    .withMessage("Newsletter subscription must be a boolean value"),
  body("subscribed.notifications")
    .optional()
    .isBoolean()
    .withMessage("Notifications subscription must be a boolean value"),
];

export { createUserValidation, updateUserValidation };
