import express from "express";

import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controllers.js";

const router = express.Router();

router.route("/").get(getAllServices);
router.route("/:id").get(getServiceById);
router.route("/").post(createService);
router.route("/:id").put(updateService);
router.route("/:id").delete(deleteService);

export default router;
