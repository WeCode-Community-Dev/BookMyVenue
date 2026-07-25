import Express from 'express'
import { ROUTES } from '../../../shared/constants/routes.js'
import { VenueParamsSchema, VenueQuerySchema } from '../../validators/VenderVenue.validator.js'
import { iUserVenueController, iUserProfileController } from '../../controllers/di.js'
import { validate } from '../../middlewares/validator.js'
import { updateProfileSchema, userChangePasswordSchema  } from '../../validators/UserProfie.validator.js'
import { RequestEmailChangeOtpSchema,verifyEmailOtpSchema } from '../../validators/UserProfie.validator.js'
import { WishlistParamsSchema } from "../../validators/UserWishlist.validator.js";
import { iUserWishlistController } from "../../controllers/di.js";
import { UpdateAccountStatusSchema } from "../../validators/UserAccount.validator.js";
import { iUserAccountController } from "../../controllers/di.js";
import cloudinaryUpload from "../../middlewares/cloudinaryUpload.js";
import { iUserBookingController } from "../../controllers/di.js"


const router = Express.Router()


//venue
router.get(ROUTES.USER.VENUE.GET_ALL, validate(VenueQuerySchema, 'query'), iUserVenueController.getAllVenues)
router.get(ROUTES.USER.VENUE.GET_BY_ID, validate(VenueParamsSchema, 'params'), iUserVenueController.getVenueById)
router.get(ROUTES.USER.VENUE.TOP_VENUES, iUserVenueController.getTopVenues)
router.get(ROUTES.USER.VENUE.SIMILAR_VENUES, validate(VenueParamsSchema, 'params'), iUserVenueController.getSimilarVenues)


//profile
router.get(
    ROUTES.USER.PROFILE.PROFILE,
    iUserProfileController.getProfile
)

router.patch(
    ROUTES.USER.PROFILE.PROFILE,
    validate(updateProfileSchema),
    iUserProfileController.updateProfile
)
router.post(
    ROUTES.USER.PROFILE.REQUEST_EMAIL_CHANGE_OTP,
    validate(RequestEmailChangeOtpSchema,'body'),
    iUserProfileController.requestEmailChangeOtp
)
router.post(
    ROUTES.USER.PROFILE.VERIFY_EMAIL_CHANGE_OTP,
   
    validate(verifyEmailOtpSchema,'body'),
    iUserProfileController.verifyEmailChangeOtp
)
router.post(
    ROUTES.USER.PROFILE.RESEND_EMAIL_CHANGE_OTP,
    
    iUserProfileController.resendEmailChangeOtp
)
router.patch(
    ROUTES.USER.PROFILE.PROFILE_IMAGE,
    cloudinaryUpload("profile-images").single("profileImage"),
    iUserProfileController.updateProfileImage
)
router.delete(
    ROUTES.USER.PROFILE.PROFILE_IMAGE,
    iUserProfileController.removeProfileImage
)
router.patch(
    ROUTES.USER.PROFILE.CHANGE_PASSWORD,
    validate(userChangePasswordSchema, "body"),
    iUserProfileController.changePassword
)

//wishlist
router.post(
    ROUTES.USER.WISHLIST.WISHLIST,
    validate(WishlistParamsSchema,"params"),
    iUserWishlistController.addToWishlist
)
router.get(
    ROUTES.USER.WISHLIST.GET,
    iUserWishlistController.getWishlist
)
router.delete(
    ROUTES.USER.WISHLIST.WISHLIST,
    validate(WishlistParamsSchema,'params'),
    iUserWishlistController.removeWishlist
)
//account
router.patch(
    ROUTES.USER.ACCOUNT.UPDATE_STATUS,
    validate(UpdateAccountStatusSchema,"body"),
    iUserAccountController.updateAccountStatus
)



// Booking
router.post(
    ROUTES.USER.BOOKING.RESERVE,
    iUserBookingController.reserveBooking
);

router.post(
    ROUTES.USER.BOOKING.CONFIRM,
    iUserBookingController.confirmBooking
);
router.get(
    ROUTES.USER.BOOKING.GET_ALL,
    iUserBookingController.getBookings
);

router.get(
    ROUTES.USER.BOOKING.GET_BY_ID,
    iUserBookingController.getBookingById
);

export default router