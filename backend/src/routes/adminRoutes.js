import express from "express";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import {
    getDashboardStats,
    getRecentActivity,
} from "../controllers/adminDashboardController.js";
import {
    getUsers,
    getUserById,
    activateUser,
    deactivateUser,
} from "../controllers/adminUserController.js";
import {
    getVenues,
    getVenueById,
    activateVenue,
    deactivateVenue,
} from "../controllers/adminVenueController.js";
import {
    getBookings,
    getBookingById,
} from "../controllers/adminBookingController.js";
import {
    getPaymentOrders,
    getPaymentHistory,
    getAbandonedPayments,
} from "../controllers/adminPaymentController.js";

const adminRouter = express.Router();

adminRouter.use(userAuthMiddleware);
adminRouter.use(authorizeRoles("admin"));

adminRouter.get("/dashboard/stats", getDashboardStats);
adminRouter.get("/dashboard/recent-activity", getRecentActivity);

adminRouter.get("/users", getUsers);
adminRouter.get("/users/:id", getUserById);
adminRouter.patch("/users/:id/activate", activateUser);
adminRouter.patch("/users/:id/deactivate", deactivateUser);

adminRouter.get("/venues", getVenues);
adminRouter.get("/venues/:id", getVenueById);
adminRouter.patch("/venues/:id/activate", activateVenue);
adminRouter.patch("/venues/:id/deactivate", deactivateVenue);

adminRouter.get("/bookings", getBookings);
adminRouter.get("/bookings/:id", getBookingById);

adminRouter.get("/payments/orders", getPaymentOrders);
adminRouter.get("/payments/history", getPaymentHistory);
adminRouter.get("/payments/abandoned", getAbandonedPayments);

export default adminRouter;
