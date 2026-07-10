import express from 'express'
import { activateAvailability, createAvailability, deactivateAvailability, getVenueAvailability } from '../controllers/venueAvailabilityController.js'
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";
import authorizeRoles from '../middleware/authorizeRoles.js';

const router = express.Router();

router.post("/create", userAuthMiddleware, authorizeRoles("provider"), createAvailability)
router.get("/:venueId",getVenueAvailability) 
router.patch("/deactivate/:slotId",userAuthMiddleware,authorizeRoles("provider"), deactivateAvailability);
router.patch("/activate/:slotId",userAuthMiddleware,authorizeRoles("provider"),activateAvailability);
export default router;