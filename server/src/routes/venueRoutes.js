import express from 'express';
import { getVenues, getNearbyVenues, getVenueById, getTownSuggestions } from "../controllers/venueController.js";

const router = express.Router();


router.get("/", getVenues);
router.get("/nearby", getNearbyVenues);
router.get("/town-suggestions", getTownSuggestions);
router.get("/:id", getVenueById);

export default router;