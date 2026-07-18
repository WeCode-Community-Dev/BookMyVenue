import Express from "express";
import { ROUTES } from "../../../shared/constants/routes.js";
import cloudinaryUpload from "../../middlewares/cloudinaryUpload.js";
import {
  iVendorVenueController,
  iVendorProfileController,
  iVendorBookingController,
  iVendorDashboardController,
  iTokenService,
} from "../../controllers/di.js";
import { validate } from "../../middlewares/validator.js";
import {
  createVenueSchema,
  VenueParamsSchema,
  VenueQuerySchema,
  VenueUpdateStatusSchema,
} from "../../validators/VenderVenue.validator.js";

import {
  UpdateVendorProfileSchema,
  ChangeVendorPasswordSchema,
} from "../../validators/vendorProfile.validator.js";

import {
  BookingParamsSchema,
  BookingQuerySchema,
} from "../../validators/vendorBooking.validator.js";
import { authHandler } from "../../middlewares/auth.middleware.js";

const router = Express.Router();

const uploadVenue = cloudinaryUpload("venues");
// const uploadVenueLicense = cloudinaryUpload("venueLicense")

//venue
router.post(
  ROUTES.OWNER.VENUE.CREATE, authHandler(iTokenService),
  uploadVenue.fields([
    { name: "images", maxCount: 10 },
    { name: "license", maxCount: 5 },
  ]),
  validate(createVenueSchema, "body"),
  iVendorVenueController.createVenue
);
router.patch(
  ROUTES.OWNER.VENUE.EDIT, authHandler(iTokenService),
  uploadVenue.fields([
    { name: "images", maxCount: 10 },
    { name: "license", maxCount: 5 },
  ]),
  validate(createVenueSchema, "body"),
  validate(VenueParamsSchema, "params"),
  iVendorVenueController.updateVenue
);
router.get(
  ROUTES.OWNER.VENUE.GET_BY_ID, authHandler(iTokenService),
  validate(VenueParamsSchema, "params"),
  iVendorVenueController.getById
);
router.get(
  ROUTES.OWNER.VENUE.GET_ALL, authHandler(iTokenService),
  validate(VenueQuerySchema, "query"),
  iVendorVenueController.getAllVenues
);
router.delete(
  ROUTES.OWNER.VENUE.DELETE, authHandler(iTokenService),
  validate(VenueParamsSchema, "params"),
  iVendorVenueController.deleteVenue
);
router.patch(
  ROUTES.OWNER.VENUE.UPDATE_STATUS, authHandler(iTokenService),
  validate(VenueParamsSchema, "params"),
  validate(VenueUpdateStatusSchema, "body"),
  iVendorVenueController.updateVenueStatus
);

//vendor profile
router.get(ROUTES.OWNER.PROFILE.GET, iVendorProfileController.getProfile);

router.patch(
  ROUTES.OWNER.PROFILE.UPDATE,
  validate(UpdateVendorProfileSchema, "body"),
  iVendorProfileController.updateProfile
);

router.patch(
  ROUTES.OWNER.PROFILE.CHANGE_PASSWORD,
  validate(ChangeVendorPasswordSchema, "body"),
  iVendorProfileController.changePassword
);

// booking

router.get(
  ROUTES.OWNER.BOOKING.GET_ALL,
  validate(BookingQuerySchema, "query"),
  iVendorBookingController.getBookings
);

router.get(
  ROUTES.OWNER.BOOKING.GET_BY_ID,
  validate(BookingParamsSchema, "params"),
  iVendorBookingController.getBookingById
);

router.get(ROUTES.OWNER.DASHBOARD, iVendorDashboardController.getDashboard);

export default router;
