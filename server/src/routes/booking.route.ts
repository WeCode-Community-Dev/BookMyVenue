import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Permissions } from "../utils/role-permission";
import {
  getMyBookingsController,
  getVenueBookingsController,
  cancelBookingController,
} from "../controllers/booking.controller";

const bookingRoute = Router();

// Customer's own bookings (any authenticated user)
bookingRoute.get("/my", isAuthenticated, getMyBookingsController);

// Owner/admin: bookings for a specific venue
bookingRoute.get(
  "/venue/:venueId",
  isAuthenticated,
  authorize(Permissions.VIEW_VENUE_BOOKINGS),
  getVenueBookingsController,
);

bookingRoute.patch(
  "/cancel/:bookingId",
  isAuthenticated,
  authorize(Permissions.CANCEL_BOOKING),
  cancelBookingController,
);

export default bookingRoute;
