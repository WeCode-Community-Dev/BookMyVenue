import { Router } from "express";
import {
    createBooking,
    getMyBookings,
} from "../controllers/bookingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const  router = Router();

router.post("/",authMiddleware, allowRoles("customer"), createBooking);

router.get(
    "/my-bookings",
    authMiddleware,
    allowRoles("customer"),
    getMyBookings
);

export default router;