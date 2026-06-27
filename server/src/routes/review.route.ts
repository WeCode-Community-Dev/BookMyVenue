import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Permissions } from "../utils/role-permission";
import {
  createReviewController,
  getVenueReviewsController,
  updateReviewController,
  deleteReviewController,
} from "../controllers/review.controller";

const reviewRoute = Router();

reviewRoute.post(
  "/create",
  isAuthenticated,
  authorize(Permissions.CREATE_REVIEW),
  createReviewController,
);

reviewRoute.get("/venue/:venueId", getVenueReviewsController);

reviewRoute.patch(
  "/update/:reviewId",
  isAuthenticated,
  authorize(Permissions.UPDATE_REVIEW),
  updateReviewController,
);

reviewRoute.delete(
  "/delete/:reviewId",
  isAuthenticated,
  authorize(Permissions.DELETE_REVIEW),
  deleteReviewController,
);

export default reviewRoute;
