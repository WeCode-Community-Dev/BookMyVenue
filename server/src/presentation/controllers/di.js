//usecase
import { VendorEditVenueUsecase } from '../../application/vendor/usecases/venue/vendor.editVenue.usecase.js'
import { VendorCreateVenueUsecase } from '../../application/vendor/usecases/venue/vendor.createVenue.usecase.js'
import { VendorGetVenueByIdUsecase } from '../../application/vendor/usecases/venue/vendor.getVenueById.usecase.js'
import { VendorDeleteVenueUsecase } from '../../application/vendor/usecases/venue/vendor.deleteVenue.usecase.js'
import { VendorUpdateVenueStatusUsecase } from '../../application/vendor/usecases/venue/venue.updateVenueStatus.usecase.js'
import { UserGetAllVenuesUsecase } from '../../application/user/usecases/venue/user.getAllVenue.usecase.js'
import { UserGetVenueByIdUsecase } from '../../application/user/usecases/venue/user.getVenueById.usecase.js'




import {VendorVenueController} from '../controllers/vendor/vendor.venueController.js'
import { UserVenueController } from '../controllers/user/user.venueController.js'
import { VenueRepository } from '../../infrastructure/repositories/venue.repository.js'
import { VendorGetAllVenuesUsecase } from '../../application/vendor/usecases/venue/vendor.getAllVenues.usecase.js'
import { CloudinaryService } from '../../infrastructure/services/cloudinaryService.js'
// import { OwnerRepository }from '../../infrastructure/repositories/owner.repository.js'

//userprofile-dh
import { UserRepository } from '../../infrastructure/repositories/user.repositories.js'
import { UserGetProfileUsecase } from '../../application/user/usecases/profile/user.getProfile.usecase.js';
import { UserUpdateProfileUsecase } from '../../application/user/usecases/profile/user.updateProfile.usecase.js'

import { UserProfileController } from './user/user.profileController.js'
import { RequestEmailChangeOtpUsecase } from '../../application/user/usecases/profile/requestEmailchangeOtp.js'
import { VerifyEmailChangeOtpUsecase } from '../../application/user/usecases/profile/verifyEmailChangeOtp.usecase.js'
import { ResendEmailChangeOtpUsecase } from '../../application/user/usecases/profile/resendEmailChangeOtp.usecase.js'
import { UserUpdateProfileImageUsecase } from '../../application/user/usecases/profile/user.updateProfileImage.usecase.js'
import { UserRemoveProfileImageUsecase } from '../../application/user/usecases/profile/user.removeProfileImage.usecase.js'

//wishlist
import { UserAddToWishlistUsecase } from '../../application/user/usecases/wishlist/user.addToWishlist.usecase.js'
import { UserWishlistController } from './user/user.wishlistController.js'
import { UserGetWishlistUsecase } from '../../application/user/usecases/wishlist/user.getWishlist.usecase.js'
import { UserRemoveWishlistUsecase } from '../../application/user/usecases/wishlist/user.removeWishlist.usecase.js'

//account
import { UserUpdateAccountStatusUsecase } from '../../application/user/usecases/account/user.updateAccountStatus.usecase.js'
import { UserAccountController } from './user/user.accountController.js'

//repository
const iVenueRepository = new VenueRepository()
// const iOwnerRepository = new OwnerRepository()
const iUserRepository=new UserRepository()


//service
const iCloudinaryService = new CloudinaryService()



//vendor
const iCreateVenueUsecase = new VendorCreateVenueUsecase(
    iVenueRepository,
)
const iUpdateVenueUsecase = new VendorEditVenueUsecase(
    iVenueRepository,
    iCloudinaryService
)
const iVendorVenueGetById = new VendorGetVenueByIdUsecase (
    iVenueRepository
)
const iVendorGetAllVenues = new VendorGetAllVenuesUsecase (
    iVenueRepository
)
const iVendorDeleteVenue = new VendorDeleteVenueUsecase(
    iVenueRepository
)
const iUpdatevenueStatus = new VendorUpdateVenueStatusUsecase (
    iVenueRepository
)


//user
const iUserGetAllVenues = new UserGetAllVenuesUsecase (
    iVenueRepository
)
const iUserGetVenueById = new UserGetVenueByIdUsecase (
    iVenueRepository
)
const iUserGetProfile=new UserGetProfileUsecase(
    iUserRepository
)
const iUserUpdateProfile=new UserUpdateProfileUsecase(
    iUserRepository
)
const iRequestEmailChangeOtp= new RequestEmailChangeOtpUsecase(
    iUserRepository
)

const iVerifyEmailChangeOtp= new VerifyEmailChangeOtpUsecase(
    iUserRepository
)
const iResendEmailChangeOtp = new ResendEmailChangeOtpUsecase(
    iUserRepository
)
const iUserUpdateProfileImage = new UserUpdateProfileImageUsecase(
    iUserRepository
)
const iUserRemoveProfileImage = new UserRemoveProfileImageUsecase(
    iUserRepository
)

//wishlist
const iUserAddToWishlist = new UserAddToWishlistUsecase(
    iUserRepository,
    iVenueRepository
)
const iUserGetWishlist = new UserGetWishlistUsecase(
    iUserRepository
)
const iUserRemoveWishlist = new UserRemoveWishlistUsecase(
    iUserRepository,
    iVenueRepository
)
//account

const iUserUpdateAccountStatus = new UserUpdateAccountStatusUsecase(
    iUserRepository
)

//controller
export const iVendorVenueController = new VendorVenueController (
    iCreateVenueUsecase,
    iUpdateVenueUsecase,
    iVendorVenueGetById,
    iVendorGetAllVenues,
    iVendorDeleteVenue,
    iUpdatevenueStatus,
)

export const iUserVenueController = new UserVenueController (
    iUserGetAllVenues,
    iUserGetVenueById,
)

export const iUserProfileController=new UserProfileController(
    iUserGetProfile,
    iUserUpdateProfile,
    iRequestEmailChangeOtp,
    iVerifyEmailChangeOtp,
    iResendEmailChangeOtp,
    iUserUpdateProfileImage,
     iUserRemoveProfileImage
   
)
export const iUserWishlistController = new UserWishlistController(
    iUserAddToWishlist,
    iUserGetWishlist,
    iUserRemoveWishlist
)
export const iUserAccountController = new UserAccountController(
    iUserUpdateAccountStatus
)

