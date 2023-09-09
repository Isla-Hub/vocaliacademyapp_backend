import express from "express";
import canPerformAction from "../middlewares/canPerformAction.js";
import { rolesAction } from "../rolesAction.js";
import { param } from "express-validator";

import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controllers.js";

import handleValidationErrors from "../middlewares/validations/handleValidationErrors.js";

import {
  createServiceValidation,
  updateServiceValidation,
} from "../middlewares/validations/serviceValidations.js";

const router = express.Router();

router
  .route("/")
  .get(canPerformAction([rolesAction.admin]), getAllServices)
  .post(
    canPerformAction([rolesAction.admin]),
    createServiceValidation,
    handleValidationErrors,
    createService
  );

router
  .route("/:id")
  .get(
    param("id").notEmpty().withMessage("Service ID is required"),
    handleValidationErrors,
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    getServiceById
  )
  .put(
    canPerformAction([rolesAction.admin]),
    updateServiceValidation,
    handleValidationErrors,
    updateService
  )
  .delete(
    param("id").notEmpty().withMessage("Service ID is required"),
    handleValidationErrors,
    canPerformAction([rolesAction.admin]),
    deleteService
  );

export default router;
