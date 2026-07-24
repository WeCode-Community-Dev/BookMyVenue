import express from 'express';
import { getMyBookings,getProviderBookings } from '../controllers/bookingController.js';
import userAuthMiddleware from '../middleware/userAuthMiddleware.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

const router = express.Router();

router.get("/my-bookings", userAuthMiddleware, getMyBookings);
router.get("/provider-bookings",userAuthMiddleware,authorizeRoles("provider"),getProviderBookings)


export default router;
