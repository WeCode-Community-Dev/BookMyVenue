import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Permissions } from "../utils/role-permission";
import {
  createVenueController,
  getVenueByIdController,
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

venueRoute.get(`/get/:venueId`, getVenueByIdController);

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
