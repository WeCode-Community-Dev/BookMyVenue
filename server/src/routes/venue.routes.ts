import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Permissions } from "../utils/role-permission";
import {
  createVenueController,
  getVenuesController,
  getMyVenuesController,
  getAllVenuesController,
  getVenueByIdController,
  approveVenueController,
  updateVenueController,
  deleteVenueController,
} from "../controllers/venue.controller";

const venueRoute = Router();

venueRoute.post(
  "/create-venue",
  isAuthenticated,
  authorize(Permissions.CREATE_VENUE),
  createVenueController,
);

venueRoute.get("/", getVenuesController);

// Owner: their own venues (approved or not)
venueRoute.get(
  "/my-venues",
  isAuthenticated,
  authorize(Permissions.CREATE_VENUE),
  getMyVenuesController,
);

venueRoute.get(
  "/admin/all-venues",
  isAuthenticated,
  authorize(Permissions.APPROVE_VENUE),
  getAllVenuesController,
);

venueRoute.get(`/get/:venueId`, getVenueByIdController);

venueRoute.patch(
  "/approve/:venueId",
  isAuthenticated,
  authorize(Permissions.APPROVE_VENUE),
  approveVenueController,
);

venueRoute.patch(
  "/update/:venueId",
  isAuthenticated,
  authorize(Permissions.UPDATE_VENUE),
  updateVenueController,
);

venueRoute.delete(
  "/delete/:venueId",
  isAuthenticated,
  authorize(Permissions.DELETE_VENUE),
  deleteVenueController,
);

export default venueRoute;
