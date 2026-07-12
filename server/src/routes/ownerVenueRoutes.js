import express from "express";

import {
  createOwnerVenue,
  getOwnerVenues,
  getOwnerVenueById,
  updateOwnerVenue,
} from "../controllers/ownerVenueController.js";

import { authenticate } from "../middleware/AuthMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize("owner"));

router.post("/", createOwnerVenue);
router.get("/", getOwnerVenues);
router.get("/:id", getOwnerVenueById);
router.patch("/:id", updateOwnerVenue);

export default router;