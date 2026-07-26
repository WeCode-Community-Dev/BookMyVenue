import Express from 'express'
import { iAdminBookingController, iAdminUserController,iAdminPaymentController, iAdminDashboardController,iTokenService ,iAdminVendorController} from '../../controllers/di.js'
import { ROUTES } from '../../../shared/constants/routes.js'
import { getAllUsersQuerySchema, updateUserStatusSchema } from '../../validators/adminUser.validator.js'
import { validate } from '../../middlewares/validator.js'
import { getAllVendorsQuerySchema, rejectVendorBodySchema, updateVendorStatusSchema } from '../../validators/adminVendor.validator.js'
import {
    getAllVenuesQuerySchema,
    venueIdParamSchema,
    rejectVenueSchema,
    updateVenueBlockStatusSchema
} from "../../validators/adminVenue.validator.js";
import { iAdminVenueController } from '../../controllers/di.js'
import { adminGetAllBookingsSchema, adminGetBookingByIdSchema } from '../../validators/adminBooking.validator.js'
import { adminGetAllPaymentsSchema, adminGetPaymentByIdSchema} from '../../validators/adminPayment.validator.js'
import { authHandler } from '../../middlewares/auth.middleware.js'

const router = Express.Router()
router.use(authHandler(iTokenService))
//Dashboard
router.get(ROUTES.ADMIN.DASHBOARD.GET_STATISTICS,authHandler(iTokenService),iAdminDashboardController.getDashboardStatistics)
//User
router.get(
    ROUTES.ADMIN.USER.GET_ALL,authHandler(iTokenService), validate(getAllUsersQuerySchema, 'query'),
    iAdminUserController.getAllUsers
)

router.patch(
    ROUTES.ADMIN.USER.UPDATE_STATUS,authHandler(iTokenService), validate(updateUserStatusSchema, 'body'),
    iAdminUserController.updateUserStatus
)
//vendor
router.get(ROUTES.ADMIN.VENDOR.GET_ALL, authHandler(iTokenService),validate(getAllVendorsQuerySchema, 'query'), iAdminVendorController.getAllVendors)
router.get(ROUTES.ADMIN.VENDOR.GET_BY_ID,authHandler(iTokenService), iAdminVendorController.getVendorById)
router.patch(ROUTES.ADMIN.VENDOR.APPROVE_VENDOR,authHandler(iTokenService), iAdminVendorController.approveVendor)
router.patch(ROUTES.ADMIN.VENDOR.REJECT_VENDOR,authHandler(iTokenService), validate(rejectVendorBodySchema, 'body'), iAdminVendorController.rejectVendor)
router.patch(ROUTES.ADMIN.VENDOR.UPDATE_STATUS,authHandler(iTokenService), validate(updateVendorStatusSchema, 'body'), iAdminVendorController.updateVendorStatus)

//venue

router.get(
    ROUTES.ADMIN.VENUE.GET_ALL,authHandler(iTokenService),
    validate(getAllVenuesQuerySchema, 'query'),
    iAdminVenueController.getAllVenues
);

router.get(
    ROUTES.ADMIN.VENUE.GET_BY_ID,authHandler(iTokenService),
    validate(venueIdParamSchema, 'params'),
    iAdminVenueController.getVenueById
);

router.patch(
    ROUTES.ADMIN.VENUE.APPROVE_VENUE,
    validate(venueIdParamSchema, 'params'),
    iAdminVenueController.approveVenue
);

router.patch(
    ROUTES.ADMIN.VENUE.REJECT_VENUE,
    validate(venueIdParamSchema, 'params', rejectVenueSchema, 'body'),
    iAdminVenueController.rejectVenue
);

router.patch(
    ROUTES.ADMIN.VENUE.UPDATE_STATUS,
    validate(venueIdParamSchema, 'params', updateVenueBlockStatusSchema, 'body'),
    iAdminVenueController.updateBlockStatus
);

//booking
router.get(
    ROUTES.ADMIN.BOOKING.GET_ALL,
    validate(adminGetAllBookingsSchema, 'query'),
    iAdminBookingController.getAllBookings
);

router.get(
    ROUTES.ADMIN.BOOKING.GET_STATISTICS,
    iAdminBookingController.getBookingStatistics
);

router.get(
    ROUTES.ADMIN.BOOKING.GET_BY_ID,
    validate(adminGetBookingByIdSchema, 'params'),
    iAdminBookingController.getBookingById
);

//payment
router.get(
    ROUTES.ADMIN.PAYMENT.GET_ALL,
    validate(adminGetAllPaymentsSchema, 'query'),
    iAdminPaymentController.getAllPayments
);

router.get(
    ROUTES.ADMIN.PAYMENT.GET_STATISTICS,
    iAdminPaymentController.getPaymentStatistics
);

router.get(
    ROUTES.ADMIN.PAYMENT.GET_BY_ID,
    validate(adminGetPaymentByIdSchema, 'params'),
    iAdminPaymentController.getPaymentById
);

export default router

