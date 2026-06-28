import Express from 'express'
import { ROUTES } from '../../../shared/constants/routes.js'
import cloudinaryUpload from '../../middlewares/cloudinaryUpload.js'
import {
    iVendorVenueController,
    iVendorProfileController,
    iVendorBookingController,
    iVendorDashboardController
} from '../../controllers/di.js'
import { validate } from '../../middlewares/validator.js'
import {
    createVenueSchema,
    VenueParamsSchema,
    VenueQuerySchema,
    VenueUpdateStatusSchema
} from '../../validators/VenderVenue.validator.js'
import { UpdateVendorProfileSchema } from '../../validators/vendorProfile.validator.js'
import {
    BookingParamsSchema,
    BookingQuerySchema
} from '../../validators/vendorBooking.validator.js'

const router = Express.Router()
const uploadVenueImages = cloudinaryUpload("venues")

// venue
router.post(ROUTES.VENDOR.VENUE.CREATE, uploadVenueImages.array("images", 10), validate(createVenueSchema, 'body'), iVendorVenueController.createVenue)
router.patch(ROUTES.VENDOR.VENUE.EDIT, uploadVenueImages.array('images', 10), validate(createVenueSchema, 'body'), validate(VenueParamsSchema, 'params'), iVendorVenueController.updateVenue)
router.get(ROUTES.VENDOR.VENUE.GET_BY_ID, validate(VenueParamsSchema, 'params'), iVendorVenueController.getById)
router.get(ROUTES.VENDOR.VENUE.GET_ALL, validate(VenueQuerySchema, 'query'), iVendorVenueController.getAllVenues)
router.delete(ROUTES.VENDOR.VENUE.DELETE, validate(VenueParamsSchema, 'params'), iVendorVenueController.deleteVenue)
router.patch(ROUTES.VENDOR.VENUE.UPDATE_STATUS, validate(VenueParamsSchema, 'params'), validate(VenueUpdateStatusSchema, 'body'), iVendorVenueController.updateVenueStatus)

// profile
router.get(ROUTES.VENDOR.PROFILE.GET, iVendorProfileController.getProfile)
router.patch(ROUTES.VENDOR.PROFILE.UPDATE, validate(UpdateVendorProfileSchema, 'body'), iVendorProfileController.updateProfile)

// booking
router.get(ROUTES.VENDOR.BOOKING.GET_ALL, validate(BookingQuerySchema, 'query'), iVendorBookingController.getBookings)
router.get(ROUTES.VENDOR.BOOKING.GET_BY_ID, validate(BookingParamsSchema, 'params'), iVendorBookingController.getBookingById)

// dashboard
router.get(ROUTES.VENDOR.DASHBOARD, iVendorDashboardController.getDashboard)

export default router
