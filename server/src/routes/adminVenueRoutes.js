import express from "express";

import {
  getAdminVenues,
  updateVenueApprovalStatus,
} from "../controllers/adminVenueController.js";

import { authenticate } from "../middleware/AuthMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize("admin"));

router.get("/", getAdminVenues);
router.patch("/:id/status", updateVenueApprovalStatus);

export default router;