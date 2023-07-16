import express from "express";
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
  .get(getAllServices)
  .post(createServiceValidation, handleValidationErrors, createService);

router
  .route("/:id")
  .get(
    param("id").notEmpty().withMessage("Service ID is required"),
    handleValidationErrors,
    getServiceById
  )
  .put(updateServiceValidation, handleValidationErrors, updateService)
  .delete(
    param("id").notEmpty().withMessage("Service ID is required"),
    handleValidationErrors,
    deleteService
  );

export default router;
