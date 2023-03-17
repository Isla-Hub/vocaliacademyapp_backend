import express from "express";

import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.route("/").get(getAllEvents);
router.route("/:id").get(getEventById);
router.route("/").post(createEvent);
router.route("/:id").put(updateEvent);
router.route("/:id").delete(deleteEvent);

export default router;
