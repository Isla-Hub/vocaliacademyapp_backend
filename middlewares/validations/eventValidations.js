import { body } from "express-validator";
import { string } from "sharp/lib/is";

const createEventValidation = [
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
  body("createdBy")
    .notEmpty()
    .withMessage("CreatedBy is required")
    .isMongoId()
    .withMessage("CreatedBy must be a valid MongoDB ObjectId"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("instructedBy")
    .notEmpty()
    .withMessage("InstructedBy is required")
    .isMongoId()
    .withMessage("InstructedBy must be a valid MongoDB ObjectId"),
  body("room")
    .notEmpty()
    .withMessage("Room is required")
    .isMongoId()
    .withMessage("Room must be a valid MongoDB ObjectId"),
  body("eventGroupSize")
    .notEmpty()
    .withMessage("EventGroupSize is required")
    .isInt({ min: 1 })
    .withMessage("EventGroupSize must be a number"),
  body("totalAttended")
    .optional()
    .notEmpty()
    .withMessage("TotalAttended cannot be empty")
    .isInt({ min: 1 })
    .withMessage("TotalAttended must be a number"),
  body("isPublic")
    .optional()
    .notEmpty()
    .withMessage("IsPublic cannot be empty")
    .isBoolean()
    .withMessage("IsPublic must be a boolean value"),
  body("categories")
    .optional()
    .notEmpty()
    .withMessage("Categories cannot be empty")
    .isArray()
    .withMessage("Categories must be an array."),
  body("level")
    .optional()
    .notEmpty()
    .withMessage("Level cannot be empty")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Level must be one of: beginner, intermediate, advanced"),
  body("internalPrice")
    .notEmpty()
    .withMessage("InternalPrice is required")
    .isNumeric()
    .withMessage("InternalPrice must be a number"),
  body("externalPrice")
    .notEmpty()
    .withMessage("ExternalPrice is required")
    .isNumeric()
    .withMessage("ExternalPrice must be a number"),
  body("internalAtendants")
    .optional()
    .notEmpty()
    .withMessage("InternalAtendants cannot be empty")
    .isArray({ isMongoId: true })
    .withMessage(
      "InternalAtendants must be an array of valid MongoDB ObjectIds."
    ),
  body("externalAtendants")
    .optional()
    .notEmpty()
    .withMessage("ExternalAtendants cannot be empty")
    .isArray({
      name: string,
      lastName: string,
      email: string,
      phoneNumber: string,
    })
    .withMessage("ExternalAtendants must be an array."),
];

const updateEventValidation = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name cannot be empty.")
    .isLength({ max: 50 }),
];

export {
  createEventValidation as createRoomValidation,
  updateEventValidation as updateRoomValidation,
};
