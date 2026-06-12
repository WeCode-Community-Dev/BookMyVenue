import { Router } from "express";

import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";

import { getMyVenues } from "../venues/venues.controller.js";

const userRoutes = Router();

userRoutes.get(
  "/me/venues",
  authenticate,
  authorize("OWNER"),
  getMyVenues
);

export default userRoutes;