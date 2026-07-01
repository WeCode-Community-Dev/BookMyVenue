// usecases - venue
import { VendorEditVenueUsecase } from '../../application/vendor/usecases/venue/vendor.editVenue.usecase.js'
import { VendorCreateVenueUsecase } from '../../application/vendor/usecases/venue/vendor.createVenue.usecase.js'
import { VendorGetVenueByIdUsecase } from '../../application/vendor/usecases/venue/vendor.getVenueById.usecase.js'
import { VendorDeleteVenueUsecase } from '../../application/vendor/usecases/venue/vendor.deleteVenue.usecase.js'
import { VendorUpdateVenueStatusUsecase } from '../../application/vendor/usecases/venue/venue.updateVenueStatus.usecase.js'
import { VendorGetAllVenuesUsecase } from '../../application/vendor/usecases/venue/vendor.getAllVenues.usecase.js'
import { UserGetAllVenuesUsecase } from '../../application/user/usecases/venue/user.getAllVenue.usecase.js'
import { UserGetVenueByIdUsecase } from '../../application/user/usecases/venue/user.getVenueById.usecase.js'
import { UserGetTopVenuesUsecase } from '../../application/user/usecases/venue/user.getTopVenue.usacase.js'

// usecases - auth
import RegisterUserUseCase from '../../application/user/usecases/RegisterUserUseCase.js'
import LoginUserUseCase from '../../application/user/usecases/LoginUserUserCase.js'
import LogoutUseCase from '../../application/user/usecases/LogoutUseCase.js'
import RefreshTokenUseCase from '../../application/user/usecases/RefreshTokenUseCase.js'
import VerifyOtpUseCase from '../../application/user/usecases/VerifyOtpUseCase.js'
import ResendOtpUseCase from '../../application/user/usecases/ResendOtpUseCase.js'
import ForgotPasswordUseCase from '../../application/user/usecases/ForgotPasswordUseCase.js'
import ResetPasswordUseCase from '../../application/user/usecases/ResetPasswordUseCase.js'
// import GoogleAuthUseCase from '../../application/user/usecases/GoogleAuthUseCase.js'  // TODO: Google Auth - temporarily disabled

// usecases - admin user
import { AdminGetAllUsersUsecase } from '../../application/admin/usecases/user/admin.getAllUsers.usecase.js'
import { AdminUpdateUserStatusUsecase } from '../../application/admin/usecases/user/admin.updateUserStatus.usecase.js'

// usecases - admin vendor
import { AdminGetAllVendorsUsecase } from '../../application/admin/usecases/vendor/admin.getAllVendors.usecase.js'
import { AdminGetVendorByIdUsecase } from '../../application/admin/usecases/vendor/admin.getVendorById.usecase.js'
import { AdminApproveVendorUsecase } from '../../application/admin/usecases/vendor/admin.approveVendor.usecase.js'
import { AdminRejectVendorUsecase } from '../../application/admin/usecases/vendor/admin.rejectVendor.usecase.js'
import { AdminUpdateVendorStatusUsecase } from '../../application/admin/usecases/vendor/admin.updateVendorStatus.js'

// usecases - admin venue
import { AdminGetAllVenuesUsecase } from '../../application/admin/usecases/venue/admin.getAllVenues.usecase.js'
import { AdminGetVenueByIdUsecase } from '../../application/admin/usecases/venue/admin.getVenueById.usecase.js'
import { AdminApproveVenueUsecase } from '../../application/admin/usecases/venue/admin.approveVenue.usecase.js'
import { AdminRejectVenueUsecase } from '../../application/admin/usecases/venue/admin.rejectVenue.usecase.js'
import { AdminUpdateVenueBlockStatusUsecase } from '../../application/admin/usecases/venue/admin.updateVenueStatus.usecase.js'

// usecases - admin booking
import { AdminGetAllBookingsUsecase } from '../../application/admin/usecases/booking/admin.getAllBookings.usecase.js'
import { AdminGetBookingByIdUsecase } from '../../application/admin/usecases/booking/admin.getBookingById.usecase.js'
import { AdminGetBookingStatisticsUsecase } from '../../application/admin/usecases/booking/admin.getBookingStatistics.usecase.js'

// usecases - vendor profile
import { GetVendorProfileUsecase } from '../../application/vendor/usecases/profile/getVendorProfile.usecase.js'
import { VendorUpdateProfileUsecase } from '../../application/vendor/usecases/profile/updateVendorProfile.usecase.js'

// usecases - vendor booking
import { GetVendorBookingsUsecase } from '../../application/vendor/usecases/booking/getVendorBookingsUsecase.js'
import { GetBookingByIdUsecase } from '../../application/vendor/usecases/booking/getBookingByIdUsecase.js'

// usecases - vendor dashboard
import { GetDashboardStatsUsecase } from '../../application/vendor/usecases/dashboard/GetDashboardStatsUsecase.js'

// controllers
import { VendorVenueController } from '../controllers/vendor/vendor.venueController.js'
import { UserVenueController } from '../controllers/user/user.venueController.js'
import { AuthController } from '../controllers/user/AuthController.js'
import { AdminUserController } from '../controllers/admin/admin.userController.js'
import { AdminVendorController } from '../controllers/admin/admin.vendorController.js'
import { AdminVenueController } from './admin/admin.venueController.js'
import { AdminBookingController } from './admin/admin.bookingController.js'
import { VendorProfileController } from './vendor/vendorProfileController.js'
import { VendorBookingController } from './vendor/VendorBookingController.js'
import { VendorDashboardController } from './vendor/VendorDashboardController.js'

// repositories
import { VenueRepository } from '../../infrastructure/repositories/venue.repository.js'
import { UserRepository } from '../../infrastructure/repositories/user.repository.js'
import VendorRepository from '../../infrastructure/repositories/vendor.repository.js'
import BookingRepositoryImpl from '../../infrastructure/repositories/booking.repository.js'

// services
import { CloudinaryService } from '../../infrastructure/services/cloudinaryService.js'
import HashService from '../../infrastructure/services/HashService.js'
import { MailServiceImpl } from '../../infrastructure/services/MailService.js'

// --- repositories ---
const iVenueRepository = new VenueRepository()
const iUserRepository = new UserRepository()
const iVendorRepository = new VendorRepository()
const bookingRepository = new BookingRepositoryImpl()

// --- services ---
const iCloudinaryService = new CloudinaryService()
const iMailService = new MailServiceImpl()

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

// --- admin booking usecases ---
const iAdminGetAllBookingUsecase = new AdminGetAllBookingsUsecase(bookingRepository)
const iAdminGetBookingByIdUsecase = new AdminGetBookingByIdUsecase(bookingRepository)
const iAdminBookingStatisticsUsecase = new AdminGetBookingStatisticsUsecase(bookingRepository)

// --- auth usecases ---
const iRegisterUserUseCase = new RegisterUserUseCase(iUserRepository, HashService)
const iLoginUserUseCase = new LoginUserUseCase(iUserRepository, HashService)
const iLogoutUseCase = new LogoutUseCase(iUserRepository)
const iRefreshTokenUseCase = new RefreshTokenUseCase(iUserRepository)
const iVerifyOtpUseCase = new VerifyOtpUseCase(iUserRepository)
const iResendOtpUseCase = new ResendOtpUseCase(iUserRepository, HashService)
const iForgotPasswordUseCase = new ForgotPasswordUseCase(iUserRepository)
const iResetPasswordUseCase = new ResetPasswordUseCase(iUserRepository, HashService)
// export const iGoogleAuthUseCase = new GoogleAuthUseCase(iUserRepository)  // TODO: Google Auth - temporarily disabled

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
const iUserGetTopVenues = new UserGetTopVenuesUsecase(iVenueRepository)

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

export const iAdminBookingController = new AdminBookingController(
    iAdminGetAllBookingUsecase,
    iAdminGetBookingByIdUsecase,
    iAdminBookingStatisticsUsecase
)

export const iUserVenueController = new UserVenueController(
    iUserGetAllVenues,
    iUserGetVenueById,
    iUserGetTopVenues
)

export const iVendorProfileController = new VendorProfileController(
    iGetVendorProfileUsecase,
    iUpdateVendorProfileUsecase
)

export const iVendorBookingController = new VendorBookingController(
    getVendorBookingsUsecase,
    getBookingByIdUsecase
)

export const iVendorDashboardController = new VendorDashboardController(
    getDashboardStatsUsecase
)

export const iAuthController = new AuthController(
    iRegisterUserUseCase,
    iLoginUserUseCase,
    iLogoutUseCase,
    iRefreshTokenUseCase,
    iVerifyOtpUseCase,
    iResendOtpUseCase,
    iForgotPasswordUseCase,
    iResetPasswordUseCase
)
