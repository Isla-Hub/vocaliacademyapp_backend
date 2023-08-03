import express from "express";
import { param } from "express-validator";
import canPerformAction from "../middlewares/canPerformAction.js";
import { rolesAction } from "../rolesAction.js";

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
    canPerformAction([
      rolesAction.admin,
      rolesAction.instructor,
      rolesAction.student,
    ]),
    param("id").notEmpty().withMessage("Service ID is required"),
    handleValidationErrors,
    getServiceById
  )
  .put(
    canPerformAction([rolesAction.admin]),
    updateServiceValidation,
    handleValidationErrors,
    updateService
  )
  .delete(
    canPerformAction([rolesAction.admin]),
    param("id").notEmpty().withMessage("Service ID is required"),
    handleValidationErrors,
    deleteService
  );

export default router;
