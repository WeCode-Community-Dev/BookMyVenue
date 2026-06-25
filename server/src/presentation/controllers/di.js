//usecase
import { VendorEditVenueUsecase } from '../../application/vendor/usecases/venue/vendor.editVenue.usecase.js'
import { VendorCreateVenueUsecase } from '../../application/vendor/usecases/venue/vendor.createVenue.usecase.js'
import { VendorGetVenueByIdUsecase } from '../../application/vendor/usecases/venue/vendor.getVenueById.usecase.js'
import { VendorDeleteVenueUsecase } from '../../application/vendor/usecases/venue/vendor.deleteVenue.usecase.js'
import { VendorUpdateVenueStatusUsecase } from '../../application/vendor/usecases/venue/venue.updateVenueStatus.usecase.js'
import { UserGetAllVenuesUsecase } from '../../application/user/usecases/venue/user.getAllVenue.usecase.js'
import { UserGetVenueByIdUsecase } from '../../application/user/usecases/venue/user.getVenueById.usecase.js'
import RegisterUserUseCase from '../../application/user/usecases/RegisterUserUseCase.js'
import LoginUserUseCase from '../../application/user/usecases/LoginUserUserCase.js'
import LogoutUseCase from '../../application/user/usecases/LogoutUseCase.js'
import RefreshTokenUseCase from '../../application/user/usecases/RefreshTokenUseCase.js'

// AdminUserUsecases
import { AdminGetAllUsersUsecase } from '../../application/admin/usecases/user/admin.getAllUsers.usecase.js'
import { AdminUpdateUserStatusUsecase } from '../../application/admin/usecases/user/admin.updateUserStatus.usecase.js'

//AdminVendorUsecases
import { AdminGetAllVendorsUsecase } from '../../application/admin/usecases/vendor/admin.getAllVendors.usecase.js'
import { AdminGetVendorByIdUsecase } from '../../application/admin/usecases/vendor/admin.getVendorById.usecase.js'
import { AdminApproveVendorUsecase } from '../../application/admin/usecases/vendor/admin.approveVendor.usecase.js'
import { AdminRejectVendorUsecase } from '../../application/admin/usecases/vendor/admin.rejectVendor.usecase.js'
import { AdminUpdateVendorStatusUsecase } from '../../application/admin/usecases/vendor/admin.updateVendorStatus.js'

// AdminUserController
import { AdminUserController } from '../controllers/admin/admin.userController.js'

//AdminVendorController
import { AdminVendorController } from '../controllers/admin/admin.vendorController.js'

import { VendorVenueController } from '../controllers/vendor/vendor.venueController.js'
import { UserVenueController } from '../controllers/user/user.venueController.js'
import { AuthController } from '../controllers/user/AuthController.js'


import { VenueRepository } from '../../infrastructure/repositories/venue.repository.js'
import { VendorGetAllVenuesUsecase } from '../../application/vendor/usecases/venue/vendor.getAllVenues.usecase.js'
import { CloudinaryService } from '../../infrastructure/services/cloudinaryService.js'
import { UserRepository } from '../../infrastructure/repositories/user.repository.js'
import HashService from '../../infrastructure/services/HashService.js'

//Vendor
import VendorRepository from '../../infrastructure/repositories/vendor.repository.js'
import { GetVendorProfileUsecase } from '../../application/vendor/usecases/profile/getVendorProfile.usecase.js'
import { VendorUpdateProfileUsecase } from '../../application/vendor/usecases/profile/updateVendorProfile.usecase.js'
import { VendorProfileController } from './vendor/vendorProfileController.js'

//Vendorbookingmanagement

import BookingRepositoryImpl from "../../infrastructure/repositories/booking.repository.js";
import { GetVendorBookingsUsecase }from "../../application/vendor/usecases/booking/getVendorBookingsUsecase.js";
import { GetBookingByIdUsecase }from "../../application/vendor/usecases/booking/getBookingByIdUsecase.js";
import { AcceptBookingUsecase }from "../../application/vendor/usecases/booking/acceptBookingUsecase.js";
import { RejectBookingUsecase }from "../../application/vendor/usecases/booking/rejectBookingUsecase.js";
import { VendorBookingController }from "./vendor/VendorBookingController.js";



//repository
const iVenueRepository = new VenueRepository()
const iUserRepository = new UserRepository()
const iVendorRepository = new VendorRepository()
const bookingRepository = new BookingRepositoryImpl();


//service
const iCloudinaryService = new CloudinaryService()

//adminUserUsecases
const iAdminGetAllUsersUsecase =
    new AdminGetAllUsersUsecase(
        iUserRepository
    )

const iAdminUpdateUserStatusUsecase =
    new AdminUpdateUserStatusUsecase(
        iUserRepository
    )

//adminVendorUsecases
const iAdminGetAllVendorsUsecase = new AdminGetAllVendorsUsecase(iVendorRepository)
const iAdminGetVendorByIdUsecase = new AdminGetVendorByIdUsecase(iVendorRepository)
const iAdminApproveVendorUsecase = new AdminApproveVendorUsecase(iVendorRepository)
const iAdminRejectVendorUsecase = new AdminRejectVendorUsecase(iVendorRepository)
const iAdminUpdateVendorStatusUsecase = new AdminUpdateVendorStatusUsecase(iVendorRepository)

//auth usecases
const iRegisterUserUseCase = new RegisterUserUseCase(iUserRepository, HashService)
const iLoginUserUseCase = new LoginUserUseCase(iUserRepository, HashService)
const iLogoutUseCase = new LogoutUseCase(iUserRepository)
const iRefreshTokenUseCase = new RefreshTokenUseCase(iUserRepository)


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

//vendor profile

const iGetVendorProfileUsecase =
    new GetVendorProfileUsecase(
        iVendorRepository
    )
const iUpdateVendorProfileUsecase =
    new VendorUpdateProfileUsecase(
        iVendorRepository
    )

export const iVendorProfileController =
    new VendorProfileController(

        iGetVendorProfileUsecase,
        iUpdateVendorProfileUsecase

    )


//vendorbookingmanagement

const getVendorBookingsUsecase =
    new GetVendorBookingsUsecase(
        bookingRepository
    );
const getBookingByIdUsecase =
    new GetBookingByIdUsecase(
        bookingRepository
    );
const acceptBookingUsecase =
    new AcceptBookingUsecase(
        bookingRepository
    );
const rejectBookingUsecase =
    new RejectBookingUsecase(
        bookingRepository
    );


//user
const iUserGetAllVenues = new UserGetAllVenuesUsecase (
    iVenueRepository
)
const iUserGetVenueById = new UserGetVenueByIdUsecase (
    iVenueRepository
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

//adminUserController
export const iAdminUserController =
    new AdminUserController(
        iAdminGetAllUsersUsecase,
        iAdminUpdateUserStatusUsecase,
    )
//adminVendorController
export const iAdminVendorControlller = 
    new AdminVendorController(
        iAdminGetAllVendorsUsecase,
        iAdminGetVendorByIdUsecase,
        iAdminApproveVendorUsecase,
        iAdminRejectVendorUsecase,
        iAdminUpdateVendorStatusUsecase
    )
export const iUserVenueController = new UserVenueController (
    iUserGetAllVenues,
    iUserGetVenueById,
)

export const iAuthController = new AuthController(
    iRegisterUserUseCase,
    iLoginUserUseCase,
    iLogoutUseCase,
    iRefreshTokenUseCase,
)

export const iVendorBookingController =

    new VendorBookingController(
        getVendorBookingsUsecase,
        getBookingByIdUsecase,
        acceptBookingUsecase,
        rejectBookingUsecase
    );