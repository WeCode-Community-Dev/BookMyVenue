import {Router} from "express";
import venueController from "../controllers/venueController.js";
import { catchErrors } from "../handlers/error_handlers.js";
import { isAuthenticated } from "../middlewares/authentication.js";
import { requireRole } from "../middlewares/authentication.js";

const router = Router();
console.log("Venue router loaded");

router.post('/venues',isAuthenticated,requireRole('owner'),catchErrors(venueController.addVenue))



export default router;