import express from "express";

import {
  createBookingInquiry,
  getOwnerBookingInquiries,
  updateBookingInquiryStatus,
  checkBookingInquiryStatus,
  cancelBookingInquiry
} from "../controllers/bookingInquiryController.js";

import { authenticate } from "../middleware/AuthMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", createBookingInquiry);
router.post("/check-status", checkBookingInquiryStatus);
router.patch("/cancel", cancelBookingInquiry);

router.get(
  "/owner",
  authenticate,
  authorize("owner"),
  getOwnerBookingInquiries
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("owner"),
  updateBookingInquiryStatus
);

export default router;