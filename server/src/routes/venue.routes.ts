import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Permissions } from "../utils/role-permission";
import { createVenueController } from "../controllers/venue.controller";

const venueRoute = Router();

venueRoute.post(
  "/create-venue",
  isAuthenticated,
  authorize(Permissions.CREATE_VENUE),
  createVenueController,
);

export default venueRoute;
