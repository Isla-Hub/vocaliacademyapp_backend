import express from "express";
import canPerformAction from "../middlewares/canPerformAction.js";
import { rolesAction } from "../rolesAction.js";

import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.route("/").get(canPerformAction([rolesAction.admin]), getAllPayments);
router
  .route("/:id")
  .get(
    canPerformAction([rolesAction.admin, rolesAction.student]),
    getPaymentById
  );
router
  .route("/")
  .post(
    canPerformAction([rolesAction.admin, rolesAction.student]),
    createPayment
  );
router.route("/:id").put(canPerformAction([rolesAction.admin]), updatePayment);
router
  .route("/:id")
  .delete(canPerformAction([rolesAction.admin]), deletePayment);

export default router;
