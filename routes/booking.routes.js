import express from "express";

import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.route("/").get(getAllBookings);
router.route("/:id").get(getBookingById);
router.route("/").post(createBooking);
router.route("/:id").put(updateBooking);
router.route("/:id").delete(deleteBooking);

export default router;
