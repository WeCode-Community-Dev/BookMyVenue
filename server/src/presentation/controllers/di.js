import { redisClient } from '../../infrastructure/config/redis.config.js'
import { VendorEditVenueUsecase } from '../../application/vendor/usecases/venue/vendor.editVenue.usecase.js'
import { VendorCreateVenueUsecase } from '../../application/vendor/usecases/venue/vendor.createVenue.usecase.js'
import { VendorGetVenueByIdUsecase } from '../../application/vendor/usecases/venue/vendor.getVenueById.usecase.js'
import { VendorDeleteVenueUsecase } from '../../application/vendor/usecases/venue/vendor.deleteVenue.usecase.js'
import { VendorUpdateVenueStatusUsecase } from '../../application/vendor/usecases/venue/venue.updateVenueStatus.usecase.js'
import { VendorGetAllVenuesUsecase } from '../../application/vendor/usecases/venue/vendor.getAllVenues.usecase.js'
import { UserGetAllVenuesUsecase } from '../../application/user/usecases/venue/user.getAllVenue.usecase.js'
import { UserGetVenueByIdUsecase } from '../../application/user/usecases/venue/user.getVenueById.usecase.js'
import { RegisterUserUseCase } from '../../application/user/usecases/auth/user.registerUser.useCase.js'
import LoginUserUseCase from '../../application/user/usecases/auth/user.loginUser.userCase.js'
import UserLogoutUseCase from '../../application/user/usecases/auth/user.logout.useCase.js'
import UserRefreshTokenUseCase from '../../application/user/usecases/auth/user.refreshToken.useCase.js'
import UserVerifyOtpUseCase from '../../application/user/usecases/auth/user.verifyOtp.useCase.js'
import UserResendOtpUseCase from '../../application/user/usecases/auth/user.resendOtp.useCase.js'
import UserForgotPasswordUseCase from '../../application/user/usecases/auth/uer.forgotPassword.useCase.js'
import UserResetPasswordUseCase from '../../application/user/usecases/auth/user.resetPassword.useCase.js'
import { AdminGetAllUsersUsecase } from '../../application/admin/usecases/user/admin.getAllUsers.usecase.js'
import { AdminUpdateUserStatusUsecase } from '../../application/admin/usecases/user/admin.updateUserStatus.usecase.js'
import { AdminGetAllVendorsUsecase } from '../../application/admin/usecases/vendor/admin.getAllVendors.usecase.js'
import { AdminGetVendorByIdUsecase } from '../../application/admin/usecases/vendor/admin.getVendorById.usecase.js'
import { AdminApproveVendorUsecase } from '../../application/admin/usecases/vendor/admin.approveVendor.usecase.js'
import { AdminRejectVendorUsecase } from '../../application/admin/usecases/vendor/admin.rejectVendor.usecase.js'
import { AdminUpdateVendorStatusUsecase } from '../../application/admin/usecases/vendor/admin.updateVendorStatus.js'
import { AdminGetAllVenuesUsecase } from '../../application/admin/usecases/venue/admin.getAllVenues.usecase.js'
import { AdminGetVenueByIdUsecase } from '../../application/admin/usecases/venue/admin.getVenueById.usecase.js'
import { AdminApproveVenueUsecase } from '../../application/admin/usecases/venue/admin.approveVenue.usecase.js'
import { AdminRejectVenueUsecase } from '../../application/admin/usecases/venue/admin.rejectVenue.usecase.js'
import { AdminUpdateVenueBlockStatusUsecase } from '../../application/admin/usecases/venue/admin.updateVenueStatus.usecase.js'
import { GetVendorProfileUsecase } from '../../application/vendor/usecases/profile/getVendorProfile.usecase.js'
import { VendorUpdateProfileUsecase } from '../../application/vendor/usecases/profile/updateVendorProfile.usecase.js'
import { GetVendorBookingsUsecase } from '../../application/vendor/usecases/booking/getVendorBookingsUsecase.js'
import { GetBookingByIdUsecase } from '../../application/vendor/usecases/booking/getBookingByIdUsecase.js'
import { GetDashboardStatsUsecase } from '../../application/vendor/usecases/dashboard/GetDashboardStatsUsecase.js'
import { AdminGetAllBookingsUsecase } from '../../application/admin/usecases/booking/admin.getAllBookings.usecase.js'
import { AdminGetBookingByIdUsecase } from '../../application/admin/usecases/booking/admin.getBookingById.usecase.js'
import { AdminGetBookingStatisticsUsecase } from '../../application/admin/usecases/booking/admin.getBookingStatistics.usecase.js'
import { AdminGetAllPaymentsUsecase } from "../../application/admin/usecases/payment/admin.getAllPayments.usecase.js";
import { AdminGetPaymentByIdUsecase } from "../../application/admin/usecases/payment/admin.getPaymentById.usecase.js";
import { AdminGetPaymentStatisticsUsecase } from "../../application/admin/usecases/payment/admin.getPaymentStatistics.usecase.js";
import { AdminUserController } from '../controllers/admin/admin.userController.js'
import { AdminVendorController } from '../controllers/admin/admin.vendorController.js'
import { AdminVenueController } from './admin/admin.venueController.js'
import { AdminBookingController } from './admin/admin.bookingController.js'
import { AdminPaymentController } from "./admin/admin.paymentController.js";
import { VendorVenueController } from '../controllers/vendor/vendor.venueController.js'
import { UserVenueController } from '../controllers/user/user.venueController.js'
import { UserAuthController } from '../controllers/user/user.authController.js'
import { VendorProfileController } from './vendor/vendorProfileController.js'
import { VendorBookingController } from './vendor/VendorBookingController.js'
import { VendorDashboardController } from './vendor/VendorDashboardController.js'
import { VenueRepository } from '../../infrastructure/repositories/venue.repository.js'
import { UserRepository } from '../../infrastructure/repositories/user.repository.js'
import VendorRepository from '../../infrastructure/repositories/vendor.repository.js'
import { BookingRepositoryImpl } from '../../infrastructure/repositories/booking.repository.js'
import { CloudinaryService } from '../../infrastructure/services/cloudinaryService.js'
import { HashService } from '../../infrastructure/services/HashService.js'
import { MailServiceImpl } from '../../infrastructure/services/MailService.js'
import { TokenService }from '../../infrastructure/services/TokenService.js'
import { OtpService } from '../../infrastructure/services/OtpService.js'
import { OtpStoreService } from '../../infrastructure/services/OtpStoreService.js'
import { UserGetProfileUsecase } from '../../application/user/usecases/profile/user.getProfile.usecase.js';
import { UserUpdateProfileUsecase } from '../../application/user/usecases/profile/user.updateProfile.usecase.js'
import { UserProfileController } from './user/user.profileController.js'
import { RequestEmailChangeOtpUsecase } from '../../application/user/usecases/profile/requestEmailchangeOtp.js'
import { VerifyEmailChangeOtpUsecase } from '../../application/user/usecases/profile/verifyEmailChangeOtp.usecase.js'
import { ResendEmailChangeOtpUsecase } from '../../application/user/usecases/profile/resendEmailChangeOtp.usecase.js'
import { UserUpdateProfileImageUsecase } from '../../application/user/usecases/profile/user.updateProfileImage.usecase.js'
import { UserRemoveProfileImageUsecase } from '../../application/user/usecases/profile/user.removeProfileImage.usecase.js'
import { UserAddToWishlistUsecase } from '../../application/user/usecases/wishlist/user.addToWishlist.usecase.js'
import { UserWishlistController } from './user/user.wishlistController.js'
import { UserGetWishlistUsecase } from '../../application/user/usecases/wishlist/user.getWishlist.usecase.js'
import { UserRemoveWishlistUsecase } from '../../application/user/usecases/wishlist/user.removeWishlist.usecase.js'
import { UserUpdateAccountStatusUsecase } from '../../application/user/usecases/account/user.updateAccountStatus.usecase.js'
import { UserAccountController } from './user/user.accountController.js'
import { PaymentRepository } from "../../infrastructure/repositories/payment.repository.js";
import { UserGetTopVenuesUsecase } from '../../application/user/usecases/venue/user.getTopVenue.usacase.js'


//repository
const iVenueRepository = new VenueRepository();
const iUserRepository = new UserRepository();
const iVendorRepository = new VendorRepository();
const iPaymentRepository = new PaymentRepository();
const bookingRepository = new BookingRepositoryImpl();

// --- services ---
const iCloudinaryService = new CloudinaryService()
const iMailService = new MailServiceImpl()
const iHashService = new HashService()
const iOtpService = new OtpService()
const iOtpStoreService = new OtpStoreService(redisClient)
export const iTokenService = new TokenService()

// --- admin user usecases ---
const iAdminGetAllUsersUsecase = new AdminGetAllUsersUsecase(iUserRepository)
const iAdminUpdateUserStatusUsecase = new AdminUpdateUserStatusUsecase(iUserRepository)

// --- admin vendor usecases ---
const iAdminGetAllVendorsUsecase = new AdminGetAllVendorsUsecase(iVendorRepository)
const iAdminGetVendorByIdUsecase = new AdminGetVendorByIdUsecase(iVendorRepository)
const iAdminApproveVendorUsecase = new AdminApproveVendorUsecase(iVendorRepository, iMailService)
const iAdminRejectVendorUsecase = new AdminRejectVendorUsecase(iVendorRepository, iMailService)
const iAdminUpdateVendorStatusUsecase = new AdminUpdateVendorStatusUsecase(iVendorRepository)

// --- admin venue usecases ---
const iAdminGetAllVenueUsecase = new AdminGetAllVenuesUsecase(iVenueRepository)
const iAdminGetVenueByIdUsecase = new AdminGetVenueByIdUsecase(iVenueRepository)
const iAdminApproveVenueUsecase = new AdminApproveVenueUsecase(iVenueRepository, iMailService)
const iAdminRejectVenueUsecase = new AdminRejectVenueUsecase(iVenueRepository, iMailService)
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
    iHashService,
    iOtpService,
    iOtpStoreService,
    iMailService
)
const iLoginUserUseCase = new LoginUserUseCase(
  iUserRepository,
  iHashService,
  iTokenService
)
const iUserLogoutUseCase = new UserLogoutUseCase(
    iUserRepository,
    iHashService,
    iTokenService
)
const iUserRefreshTokenUseCase = new UserRefreshTokenUseCase(
  iUserRepository,
  iTokenService,
  iHashService
)
const iUserVerifyOtpUseCase = new UserVerifyOtpUseCase(
  iUserRepository,
  iOtpService,
  iOtpStoreService
)
const iUserResendOtpUseCase = new UserResendOtpUseCase(
  iUserRepository,
  iOtpService,
  iOtpStoreService,
  iMailService
)
const iUserForgotPasswordUseCase = new UserForgotPasswordUseCase(
    iUserRepository,
    iTokenService,
    iMailService,
    iHashService
)
const iUserResetPasswordUseCase = new UserResetPasswordUseCase(
    iUserRepository,
    iHashService
)

// --- vendor usecases ---
const iCreateVenueUsecase = new VendorCreateVenueUsecase(iVenueRepository)
const iUpdateVenueUsecase = new VendorEditVenueUsecase(iVenueRepository, iCloudinaryService)
const iVendorVenueGetById = new VendorGetVenueByIdUsecase(iVenueRepository)
const iVendorGetAllVenues = new VendorGetAllVenuesUsecase(iVenueRepository)
const iVendorDeleteVenue = new VendorDeleteVenueUsecase(iVenueRepository)
const iUpdatevenueStatus = new VendorUpdateVenueStatusUsecase(iVenueRepository)
const iGetVendorProfileUsecase = new GetVendorProfileUsecase(iVendorRepository)
const iUpdateVendorProfileUsecase = new VendorUpdateProfileUsecase(iVendorRepository)
const getVendorBookingsUsecase = new GetVendorBookingsUsecase(bookingRepository)
const getBookingByIdUsecase = new GetBookingByIdUsecase(bookingRepository)
const getDashboardStatsUsecase = new GetDashboardStatsUsecase(iVenueRepository, bookingRepository)

// --- user usecases ---
const iUserGetAllVenues = new UserGetAllVenuesUsecase(iVenueRepository)
const iUserGetVenueById = new UserGetVenueByIdUsecase(iVenueRepository)
const iUserGetTopeVenues = new UserGetTopVenuesUsecase(iVenueRepository)

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
const iUserUpdateAccountStatus = new UserUpdateAccountStatusUsecase(
    iUserRepository
)

const iUserGetProfile=new UserGetProfileUsecase(
    iUserRepository
)
const iUserUpdateProfile=new UserUpdateProfileUsecase(
    iUserRepository
)
const iRequestEmailChangeOtp= new RequestEmailChangeOtpUsecase(
    iUserRepository,
    iHashService,
    iOtpService, 
    iMailService
)

const iVerifyEmailChangeOtp= new VerifyEmailChangeOtpUsecase(
    iUserRepository,
    iHashService
)
const iResendEmailChangeOtp = new ResendEmailChangeOtpUsecase(
    iUserRepository,
    iHashService,
    iOtpService, 
    iMailService
)
const iUserUpdateProfileImage = new UserUpdateProfileImageUsecase(
    iUserRepository
)
const iUserRemoveProfileImage = new UserRemoveProfileImageUsecase(
    iUserRepository
)

// --- controllers ---
export const iVendorVenueController = new VendorVenueController(
    iCreateVenueUsecase,
    iUpdateVenueUsecase,
    iVendorVenueGetById,
    iVendorGetAllVenues,
    iVendorDeleteVenue,
    iUpdatevenueStatus
)
export const iAdminUserController = new AdminUserController(
    iAdminGetAllUsersUsecase,
    iAdminUpdateUserStatusUsecase
)
export const iAdminVendorController = new AdminVendorController(
    iAdminGetAllVendorsUsecase,
    iAdminGetVendorByIdUsecase,
    iAdminApproveVendorUsecase,
    iAdminRejectVendorUsecase,
    iAdminUpdateVendorStatusUsecase
)
export const iAdminVenueController = new AdminVenueController(
    iAdminGetAllVenueUsecase,
    iAdminGetVenueByIdUsecase,
    iAdminApproveVenueUsecase,
    iAdminRejectVenueUsecase,
    iAdminUpdateVenueBlockStatusUsecase
)
export const iUserVenueController = new UserVenueController (
    iUserGetAllVenues,
    iUserGetVenueById,
    iUserGetTopeVenues
)
export const iVendorProfileController = new VendorProfileController(
    iGetVendorProfileUsecase,
    iUpdateVendorProfileUsecase
)

//--
export const iVendorBookingController = new VendorBookingController(
    getVendorBookingsUsecase,
    getBookingByIdUsecase
)
export const iUserProfileController = new UserProfileController(
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
//--
export const iAdminBookingController = new AdminBookingController(
    iAdminGetAllBookingUsecase,
    iAdminGetBookingByIdUsecase,
    iAdminBookingStatisticsUsecase
)
//--
export const iAdminPaymentController = new AdminPaymentController(
    iAdminGetAllPaymentUsecase,
    iAdminGetPaymentByIdUsecase,
    iAdminPaymentStatisticsUsecase
);

export const iUserAuthController = new UserAuthController(
    iRegisterUserUseCase,
    iLoginUserUseCase,
    iUserLogoutUseCase,
    iUserRefreshTokenUseCase,
    iUserVerifyOtpUseCase,
    iUserResendOtpUseCase,
    iUserForgotPasswordUseCase,
    iUserResetPasswordUseCase,
)

export const iVendorDashboardController = new VendorDashboardController(
  getDashboardStatsUsecase
);