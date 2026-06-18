import express from "express";

import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
} from "./bookings.controller.js";

import {authenticate} from "../../shared/middlewares/auth.middleware.js";

import {authorize} from "../../shared/middlewares/authorize.middleware.js";

import {validate} from "../../shared/middlewares/validate.middleware.js";

import {
    createBookingSchema,
    updateBookingStatusSchema,
  } from "./bookings.validation.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("USER"),
  validate(createBookingSchema),
  createBooking
);

router.get(
  "/my",
  authenticate,
  getMyBookings
);

router.get(
  "/owner",
  authenticate,
  authorize("OWNER"),
  getOwnerBookings
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("OWNER"),
  validate(updateBookingStatusSchema),
  updateBookingStatus
);

export default router;