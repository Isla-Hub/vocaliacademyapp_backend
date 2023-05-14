import express from "express";

import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.route("/").get(getAllPayments);
router.route("/:id").get(getPaymentById);
router.route("/").post(createPayment);
router.route("/:id").put(updatePayment);
router.route("/:id").delete(deletePayment);

export default router;
