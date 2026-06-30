import { Router } from "express";
import { ownerController } from "../controllers/ownerController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/bookings", authenticate, authorize("OWNER"), ownerController.listBookings);

export default router;
