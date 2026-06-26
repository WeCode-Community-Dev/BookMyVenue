//usecase
import { VendorEditVenueUsecase } from "../../application/vendor/usecases/venue/vendor.editVenue.usecase.js";
import { VendorCreateVenueUsecase } from "../../application/vendor/usecases/venue/vendor.createVenue.usecase.js";
import { VendorGetVenueByIdUsecase } from "../../application/vendor/usecases/venue/vendor.getVenueById.usecase.js";
import { VendorDeleteVenueUsecase } from "../../application/vendor/usecases/venue/vendor.deleteVenue.usecase.js";
import { VendorUpdateVenueStatusUsecase } from "../../application/vendor/usecases/venue/venue.updateVenueStatus.usecase.js";
import { UserGetAllVenuesUsecase } from "../../application/user/usecases/venue/user.getAllVenue.usecase.js";
import { UserGetVenueByIdUsecase } from "../../application/user/usecases/venue/user.getVenueById.usecase.js";
import RegisterUserUseCase from "../../application/user/usecases/RegisterUserUseCase.js";
import LoginUserUseCase from "../../application/user/usecases/LoginUserUserCase.js";
import LogoutUseCase from "../../application/user/usecases/LogoutUseCase.js";
import RefreshTokenUseCase from "../../application/user/usecases/RefreshTokenUseCase.js";

// AdminUserUsecases
import { AdminGetAllUsersUsecase } from "../../application/admin/usecases/user/admin.getAllUsers.usecase.js";
import { AdminBlockUserUsecase } from "../../application/admin/usecases/user/admin.blockUser.usecase.js";
import { AdminUnblockUserUsecase } from "../../application/admin/usecases/user/admin.unblockUser.usecase.js";

import { VendorVenueController } from "../controllers/vendor/vendor.venueController.js";
import { UserVenueController } from "../controllers/user/user.venueController.js";
import { AuthController } from "../controllers/user/AuthController.js";

// AdminController
import { AdminUserController } from "../controllers/admin/admin.userController.js";

import { VenueRepository } from "../../infrastructure/repositories/venue.repository.js";
import { VendorGetAllVenuesUsecase } from "../../application/vendor/usecases/venue/vendor.getAllVenues.usecase.js";
import { CloudinaryService } from "../../infrastructure/services/cloudinaryService.js";
import { UserRepository } from "../../infrastructure/repositories/user.repository.js";
import HashService from "../../infrastructure/services/HashService.js";

//Vendor
import VendorRepository from "../../infrastructure/repositories/vendor.repository.js";
import { GetVendorProfileUsecase } from "../../application/vendor/usecases/profile/getVendorProfile.usecase.js";
import { VendorUpdateProfileUsecase } from "../../application/vendor/usecases/profile/updateVendorProfile.usecase.js";
import { VendorProfileController } from "./vendor/vendorProfileController.js";

//Vendorbookingmanagement

import BookingRepositoryImpl from "../../infrastructure/repositories/booking.repository.js";
import { GetVendorBookingsUsecase } from "../../application/vendor/usecases/booking/getVendorBookingsUsecase.js";
import { GetBookingByIdUsecase } from "../../application/vendor/usecases/booking/getBookingByIdUsecase.js";
import { VendorBookingController } from "./vendor/VendorBookingController.js";


//dashboard

import { GetDashboardStatsUsecase } from "../../application/vendor/usecases/dashboard/GetDashboardStatsUsecase.js";
import { VendorDashboardController } from "./vendor/VendorDashboardController.js";

//repository
const iVenueRepository = new VenueRepository();
const iUserRepository = new UserRepository();
const iVendorRepository = new VendorRepository();
const bookingRepository = new BookingRepositoryImpl();


//service
const iCloudinaryService = new CloudinaryService();

//adminUserUsecases
const iAdminGetAllUsersUsecase = new AdminGetAllUsersUsecase(iUserRepository);

const iAdminBlockUserUsecase = new AdminBlockUserUsecase(iUserRepository);

const iAdminUnblockUserUsecase = new AdminUnblockUserUsecase(iUserRepository);

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
const iUserGetAllVenues = new UserGetAllVenuesUsecase(iVenueRepository);
const iUserGetVenueById = new UserGetVenueByIdUsecase(iVenueRepository);

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
export const iAdminUserController = new AdminUserController(
  iAdminGetAllUsersUsecase,
  iAdminBlockUserUsecase,
  iAdminUnblockUserUsecase
);

export const iUserVenueController = new UserVenueController(
  iUserGetAllVenues,
  iUserGetVenueById
);

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
