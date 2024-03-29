import express from "express";
import canPerformAction from "../middlewares/canPerformAction.js";
import { rolesAction } from "../rolesAction.js";
import { param } from "express-validator";

import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from "../controllers/payment.controller.js";

import {
  createPaymentValidation,
  updatePaymentValidation,
} from "../middlewares/validations/paymentValidation.js";

import handleValidationErrors from "../middlewares/validations/handleValidationErrors.js";

const router = express.Router();

router
  .route("/")
  .get(canPerformAction([rolesAction.admin]), getAllPayments)
  .post(
    canPerformAction([rolesAction.admin, rolesAction.student]),
    createPaymentValidation,
    handleValidationErrors,
    createPayment
  );
router
  .route("/:id")
  .get(
    param("id").notEmpty().withMessage("Payment ID is required"),
    handleValidationErrors,
    canPerformAction([rolesAction.admin, rolesAction.student]),
    getPaymentById
  )
  .put(
    canPerformAction([rolesAction.admin]),
    updatePaymentValidation,
    handleValidationErrors,
    updatePayment
  )
  .delete(
    param("id").notEmpty().withMessage("Payment ID is required"),
    handleValidationErrors,
    canPerformAction([rolesAction.admin]),
    deletePayment
  );

export default router;
