import Express from 'express'
import { ROUTES } from '../../../shared/constants/routes.js'
import { VenueParamsSchema, VenueQuerySchema } from '../../validators/VenderVenue.validator.js'
import { iUserVenueController, iUserProfileController, iTokenService } from '../../controllers/di.js'
import { validate } from '../../middlewares/validator.js'
import { updateProfileSchema, userChangePasswordSchema  } from '../../validators/UserProfie.validator.js'
import { RequestEmailChangeOtpSchema,verifyEmailOtpSchema } from '../../validators/UserProfie.validator.js'
import { WishlistParamsSchema } from "../../validators/UserWishlist.validator.js";
import { iUserWishlistController } from "../../controllers/di.js";
import { UpdateAccountStatusSchema } from "../../validators/UserAccount.validator.js";
import { iUserAccountController } from "../../controllers/di.js";
import cloudinaryUpload from "../../middlewares/cloudinaryUpload.js";
import { iUserBookingController } from "../../controllers/di.js"
import { authHandler } from '../../middlewares/auth.middleware.js'
import {ReserveBookingSchema, CancelBookingSchema} from "../../validators/userBooking.validator.js";


const router = Express.Router()


//venue
router.get(ROUTES.USER.VENUE.GET_ALL, validate(VenueQuerySchema, 'query'), iUserVenueController.getAllVenues)
router.get(ROUTES.USER.VENUE.GET_BY_ID, validate(VenueParamsSchema, 'params'), iUserVenueController.getVenueById)
router.get(ROUTES.USER.VENUE.TOP_VENUES, iUserVenueController.getTopVenues)
router.get(ROUTES.USER.VENUE.SIMILAR_VENUES, validate(VenueParamsSchema, 'params'), iUserVenueController.getSimilarVenues)


//profile
router.get(
    ROUTES.USER.PROFILE.PROFILE, authHandler(iTokenService),
    iUserProfileController.getProfile
)

router.patch(
    ROUTES.USER.PROFILE.PROFILE,
    authHandler(iTokenService),
    validate(updateProfileSchema),
    iUserProfileController.updateProfile
)
router.post(
    ROUTES.USER.PROFILE.REQUEST_EMAIL_CHANGE_OTP,
    authHandler(iTokenService),
    validate(RequestEmailChangeOtpSchema,'body'),
    iUserProfileController.requestEmailChangeOtp
)
router.post(
    ROUTES.USER.PROFILE.VERIFY_EMAIL_CHANGE_OTP,
   authHandler(iTokenService),
    validate(verifyEmailOtpSchema,'body'),
    iUserProfileController.verifyEmailChangeOtp
)
router.post(
    ROUTES.USER.PROFILE.RESEND_EMAIL_CHANGE_OTP,
    authHandler(iTokenService),
    iUserProfileController.resendEmailChangeOtp
)
router.patch(
    ROUTES.USER.PROFILE.PROFILE_IMAGE,
    authHandler(iTokenService),
    cloudinaryUpload("profile-images").single("profileImage"),
    iUserProfileController.updateProfileImage
)
router.delete(
    ROUTES.USER.PROFILE.PROFILE_IMAGE,
    authHandler(iTokenService),
    iUserProfileController.removeProfileImage
)
router.patch(
    ROUTES.USER.PROFILE.CHANGE_PASSWORD,
    authHandler(iTokenService),
    validate(userChangePasswordSchema, "body"),
    iUserProfileController.changePassword
)

//wishlist
router.post(
    ROUTES.USER.WISHLIST.WISHLIST,
    authHandler(iTokenService),
    validate(WishlistParamsSchema,"params"),
    iUserWishlistController.addToWishlist
)
router.get(
    ROUTES.USER.WISHLIST.GET,
    authHandler(iTokenService),
    iUserWishlistController.getWishlist
)
router.delete(
    ROUTES.USER.WISHLIST.WISHLIST,
    authHandler(iTokenService),
    validate(WishlistParamsSchema,'params'),
    iUserWishlistController.removeWishlist
)
//account
router.patch(
    ROUTES.USER.ACCOUNT.UPDATE_STATUS,
    authHandler(iTokenService),
    validate(UpdateAccountStatusSchema,"body"),
    iUserAccountController.updateAccountStatus
)



// Booking
router.post(
    ROUTES.USER.BOOKING.RESERVE,
    authHandler(iTokenService),
    iUserBookingController.reserveBooking
);

router.post(
    ROUTES.USER.BOOKING.CONFIRM,
    authHandler(iTokenService),
    iUserBookingController.confirmBooking
);
router.get(
    ROUTES.USER.BOOKING.GET_ALL,
    authHandler(iTokenService),
    iUserBookingController.getBookings
);

router.get(
    ROUTES.USER.BOOKING.GET_BY_ID,
    authHandler(iTokenService),
    iUserBookingController.getBookingById
);
router.patch(
    ROUTES.USER.BOOKING.CANCEL,
    authHandler(iTokenService),
    validate(CancelBookingSchema, "body"),
    iUserBookingController.cancelBooking
);

export default router