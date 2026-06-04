// Venue routes
import { Router } from "express";
import { venueController } from "../controllers/venueController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", venueController.register);
router.post("/login", venueController.login);
router.get("/me", authenticateUser, venueController.getMe);

export default router;