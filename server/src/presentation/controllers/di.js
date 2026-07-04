//usecase
import { VendorEditVenueUsecase } from "../../application/vendor/usecases/venue/vendor.editVenue.usecase.js";
import { VendorCreateVenueUsecase } from "../../application/vendor/usecases/venue/vendor.createVenue.usecase.js";
import { VendorGetVenueByIdUsecase } from "../../application/vendor/usecases/venue/vendor.getVenueById.usecase.js";
import { VendorDeleteVenueUsecase } from "../../application/vendor/usecases/venue/vendor.deleteVenue.usecase.js";
import { VendorUpdateVenueStatusUsecase } from "../../application/vendor/usecases/venue/venue.updateVenueStatus.usecase.js";
import { UserGetAllVenuesUsecase } from "../../application/user/usecases/venue/user.getAllVenue.usecase.js";
import { UserGetVenueByIdUsecase } from "../../application/user/usecases/venue/user.getVenueById.usecase.js";
import { UserGetTopVenuesUsecase } from "../../application/user/usecases/venue/user.getTopVenue.usacase.js";
import RegisterUserUseCase from "../../application/user/usecases/RegisterUserUseCase.js";
import LoginUserUseCase from "../../application/user/usecases/LoginUserUserCase.js";
import LogoutUseCase from "../../application/user/usecases/LogoutUseCase.js";
import RefreshTokenUseCase from "../../application/user/usecases/RefreshTokenUseCase.js";

// AdminUserUsecases


import { AdminGetAllUsersUsecase } from '../../application/admin/usecases/user/admin.getAllUsers.usecase.js'
import { AdminUpdateUserStatusUsecase } from '../../application/admin/usecases/user/admin.updateUserStatus.usecase.js'

//AdminVendorUsecases
import { AdminGetAllVendorsUsecase } from '../../application/admin/usecases/vendor/admin.getAllVendors.usecase.js'
import { AdminGetVendorByIdUsecase } from '../../application/admin/usecases/vendor/admin.getVendorById.usecase.js'
import { AdminApproveVendorUsecase } from '../../application/admin/usecases/vendor/admin.approveVendor.usecase.js'
import { AdminRejectVendorUsecase } from '../../application/admin/usecases/vendor/admin.rejectVendor.usecase.js'
import { AdminUpdateVendorStatusUsecase } from '../../application/admin/usecases/vendor/admin.updateVendorStatus.js'

//AdminVenueUsecases
import { AdminGetAllVenuesUsecase } from '../../application/admin/usecases/venue/admin.getAllVenues.usecase.js'
import { AdminGetVenueByIdUsecase } from '../../application/admin/usecases/venue/admin.getVenueById.usecase.js'
import { AdminApproveVenueUsecase } from '../../application/admin/usecases/venue/admin.approveVenue.usecase.js'
import { AdminRejectVenueUsecase } from '../../application/admin/usecases/venue/admin.rejectVenue.usecase.js'
import { AdminUpdateVenueBlockStatusUsecase } from '../../application/admin/usecases/venue/admin.updateVenueStatus.usecase.js'

//AdminBookingUsecases
import { AdminGetAllBookingsUsecase } from '../../application/admin/usecases/booking/admin.getAllBookings.usecase.js'
import { AdminGetBookingByIdUsecase } from '../../application/admin/usecases/booking/admin.getBookingById.usecase.js'
import { AdminGetBookingStatisticsUsecase } from '../../application/admin/usecases/booking/admin.getBookingStatistics.usecase.js'

//AdminpaymentUsecases
import { AdminGetAllPaymentsUsecase } from "../../application/admin/usecases/payment/admin.getAllPayments.usecase.js";
import { AdminGetPaymentByIdUsecase } from "../../application/admin/usecases/payment/admin.getPaymentById.usecase.js";
import { AdminGetPaymentStatisticsUsecase } from "../../application/admin/usecases/payment/admin.getPaymentStatistics.usecase.js";
// AdminUserController
import { AdminUserController } from '../controllers/admin/admin.userController.js'

//AdminVendorController
import { AdminVendorController } from '../controllers/admin/admin.vendorController.js'

//AdminVenueController
import { AdminVenueController } from './admin/admin.venueController.js'

//AdminBookingController
import { AdminBookingController } from './admin/admin.bookingController.js'

//AdminPaymentController
import { AdminPaymentController } from "./admin/admin.paymentController.js";

import { VendorVenueController } from '../controllers/vendor/vendor.venueController.js'

import { UserVenueController } from '../controllers/user/user.venueController.js'
import { AuthController } from '../controllers/user/AuthController.js'


import { VenueRepository } from '../../infrastructure/repositories/venue.repository.js'
import { VendorGetAllVenuesUsecase } from '../../application/vendor/usecases/venue/vendor.getAllVenues.usecase.js'
import { CloudinaryService } from '../../infrastructure/services/cloudinaryService.js'

import HashService from '../../infrastructure/services/HashService.js'
import OtpService from '../../infrastructure/services/OtpService.js'
//mailService
import { MailServiceImpl } from '../../infrastructure/services/MailService.js'

//Vendor
import VendorRepository from "../../infrastructure/repositories/vendor.repository.js";
import { GetVendorProfileUsecase } from "../../application/vendor/usecases/profile/getVendorProfile.usecase.js";
import { VendorUpdateProfileUsecase } from "../../application/vendor/usecases/profile/updateVendorProfile.usecase.js";
import { VendorProfileController } from "./vendor/vendorProfileController.js";

//Vendorbookingmanagement

import { BookingRepositoryImpl } from "../../infrastructure/repositories/booking.repository.js";
import { GetVendorBookingsUsecase } from "../../application/vendor/usecases/booking/getVendorBookingsUsecase.js";
import { GetBookingByIdUsecase } from "../../application/vendor/usecases/booking/getBookingByIdUsecase.js";
import { VendorBookingController } from "./vendor/VendorBookingController.js";

//userprofile-dh
import { UserRepository } from '../../infrastructure/repositories/user.repository.js'
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

import { PaymentRepository } from "../../infrastructure/repositories/payment.repository.js";
//repository

// const iOwnerRepository = new OwnerRepository()


//dashboard

import { GetDashboardStatsUsecase } from "../../application/vendor/usecases/dashboard/GetDashboardStatsUsecase.js";
import { VendorDashboardController } from "./vendor/VendorDashboardController.js";

//repository
const iVenueRepository = new VenueRepository();
const iUserRepository = new UserRepository();
const iVendorRepository = new VendorRepository();
const iPaymentRepository = new PaymentRepository();
const bookingRepository = new BookingRepositoryImpl();



const iCloudinaryService = new CloudinaryService()
//mailService
const iMailSErvice = new MailServiceImpl()

//adminUserUsecases
const iAdminGetAllUsersUsecase = new AdminGetAllUsersUsecase(iUserRepository);

const iAdminUpdateUserStatusUsecase =
    new AdminUpdateUserStatusUsecase(
        iUserRepository
    )


//adminVendorUsecases
const iAdminGetAllVendorsUsecase = new AdminGetAllVendorsUsecase(iVendorRepository)
const iAdminGetVendorByIdUsecase = new AdminGetVendorByIdUsecase(iVendorRepository)
const iAdminApproveVendorUsecase = new AdminApproveVendorUsecase(iVendorRepository,iMailSErvice)
const iAdminRejectVendorUsecase = new AdminRejectVendorUsecase(iVendorRepository,iMailSErvice)
const iAdminUpdateVendorStatusUsecase = new AdminUpdateVendorStatusUsecase(iVendorRepository)

//adminVenueUsecases
const iAdminGetAllVenueUsecase = new AdminGetAllVenuesUsecase(iVenueRepository)
const iAdminGetVenueByIdUsecase = new AdminGetVenueByIdUsecase(iVenueRepository)
const iAdminApproveVenueUsecase = new AdminApproveVenueUsecase(iVenueRepository,iMailSErvice)
const iAdminRejectVenueUsecase = new AdminRejectVenueUsecase(iVenueRepository,iMailSErvice)
const iAdminUpdateVenueBlockStatusUsecase = new AdminUpdateVenueBlockStatusUsecase(iVenueRepository)

//adminBookingUsecases
const iAdminGetAllBookingUsecase = new AdminGetAllBookingsUsecase(bookingRepository)
const iAdminGetBookingByIdUsecase = new AdminGetBookingByIdUsecase(bookingRepository)
const iAdminBookingStatisticsUsecase = new AdminGetBookingStatisticsUsecase(bookingRepository)

//adminPaymentUsecases
const iAdminGetAllPaymentUsecase = new AdminGetAllPaymentsUsecase(iPaymentRepository)
const iAdminGetPaymentByIdUsecase = new AdminGetPaymentByIdUsecase(iPaymentRepository)
const iAdminPaymentStatisticsUsecase = new AdminGetPaymentStatisticsUsecase(iPaymentRepository)

//auth usecases
const iRegisterUserUseCase = new RegisterUserUseCase(
  iUserRepository,
  HashService
);
const iLoginUserUseCase = new LoginUserUseCase(iUserRepository, HashService);
const iLogoutUseCase = new LogoutUseCase(iUserRepository);
const iRefreshTokenUseCase = new RefreshTokenUseCase(iUserRepository);

//vendor
const iCreateVenueUsecase = new VendorCreateVenueUsecase(iVenueRepository);
const iUpdateVenueUsecase = new VendorEditVenueUsecase(
  iVenueRepository,
  iCloudinaryService
);
const iVendorVenueGetById = new VendorGetVenueByIdUsecase(iVenueRepository);
const iVendorGetAllVenues = new VendorGetAllVenuesUsecase(iVenueRepository);
const iVendorDeleteVenue = new VendorDeleteVenueUsecase(iVenueRepository);
const iUpdatevenueStatus = new VendorUpdateVenueStatusUsecase(iVenueRepository);

//vendor profile

const iGetVendorProfileUsecase = new GetVendorProfileUsecase(iVendorRepository);
const iUpdateVendorProfileUsecase = new VendorUpdateProfileUsecase(
  iVendorRepository
);

export const iVendorProfileController = new VendorProfileController(
  iGetVendorProfileUsecase,
  iUpdateVendorProfileUsecase
);

//dashboard

const getDashboardStatsUsecase = new GetDashboardStatsUsecase(
  iVenueRepository,

  bookingRepository
);

//vendorbookingmanagement

const getVendorBookingsUsecase = new GetVendorBookingsUsecase(
  bookingRepository
);
const getBookingByIdUsecase = new GetBookingByIdUsecase(bookingRepository);

//user


const iUserGetProfile=new UserGetProfileUsecase(
    iUserRepository
)
const iUserUpdateProfile=new UserUpdateProfileUsecase(
    iUserRepository
)
const iRequestEmailChangeOtp= new RequestEmailChangeOtpUsecase(
    iUserRepository,HashService,OtpService, iMailSErvice
)

const iVerifyEmailChangeOtp= new VerifyEmailChangeOtpUsecase(
    iUserRepository,HashService
)
const iResendEmailChangeOtp = new ResendEmailChangeOtpUsecase(
    iUserRepository,HashService,OtpService, iMailSErvice
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

const iUserGetAllVenues = new UserGetAllVenuesUsecase(iVenueRepository);
const iUserGetVenueById = new UserGetVenueByIdUsecase(iVenueRepository);
const iUserGetTopeVenues = new UserGetTopVenuesUsecase(iVenueRepository)


//controller
export const iVendorVenueController = new VendorVenueController(
  iCreateVenueUsecase,
  iUpdateVenueUsecase,
  iVendorVenueGetById,
  iVendorGetAllVenues,
  iVendorDeleteVenue,
  iUpdatevenueStatus
);

//adminUserController


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


export const iAdminUserController =
    new AdminUserController(
        iAdminGetAllUsersUsecase,
        iAdminUpdateUserStatusUsecase,
    )
//adminVendorController
export const iAdminVendorController = 
    new AdminVendorController(
        iAdminGetAllVendorsUsecase,
        iAdminGetVendorByIdUsecase,
        iAdminApproveVendorUsecase,
        iAdminRejectVendorUsecase,
        iAdminUpdateVendorStatusUsecase
    )
//adminVenueController
export const iAdminVenueController = 
    new AdminVenueController(
        iAdminGetAllVenueUsecase,
        iAdminGetVenueByIdUsecase,
        iAdminApproveVenueUsecase,
        iAdminRejectVenueUsecase,
        iAdminUpdateVenueBlockStatusUsecase,
    )

//adminBookingController
export const iAdminBookingController =
    new AdminBookingController(
        iAdminGetAllBookingUsecase,
        iAdminGetBookingByIdUsecase,
        iAdminBookingStatisticsUsecase

    )
//adminPaymentController
export const iAdminPaymentController =
    new AdminPaymentController(
      iAdminGetAllPaymentUsecase,
      iAdminGetPaymentByIdUsecase,
      iAdminPaymentStatisticsUsecase
    );

export const iUserVenueController = new UserVenueController (
    iUserGetAllVenues,
    iUserGetVenueById,
    iUserGetTopeVenues
)

export const iAuthController = new AuthController(
  iRegisterUserUseCase,
  iLoginUserUseCase,
  iLogoutUseCase,
  iRefreshTokenUseCase
);

export const iVendorBookingController = new VendorBookingController(
  getVendorBookingsUsecase,
  getBookingByIdUsecase
);

export const iVendorDashboardController = new VendorDashboardController(
  getDashboardStatsUsecase
);

