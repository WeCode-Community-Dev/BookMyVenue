import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { BadRequestException, UnauthorizedException } from "../utils/appError";
import { RoleEnumType } from "../enums/user-enum";
import {
  createReviewService,
  getVenueReviewsService,
  updateReviewService,
  deleteReviewService,
} from "../services/review.service";
import { createReviewSchema, updateReviewSchema } from "../validator/review.validator";

export const createReviewController = asyncHandler(async (req: Request, res: Response) => {
  const customer = req.user?.userId;
  if (!customer) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const data = createReviewSchema.parse(req.body);

  const review = await createReviewService({ ...data, customer });

  return res.status(HTTP_STATUS.CREATED).json({
    message: "Review created successfully",
    review,
  });
});

export const getVenueReviewsController = asyncHandler(async (req: Request, res: Response) => {
  const venueId = req.params.venueId;
  if (typeof venueId !== "string" || !isValidObjectId(venueId)) {
    throw new BadRequestException("Invalid venue id");
  }

  const reviews = await getVenueReviewsService(venueId);

  return res.status(HTTP_STATUS.OK).json({
    message: "Reviews fetched successfully",
    reviews,
  });
});

export const updateReviewController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  if (!userId || !role) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const reviewId = req.params.reviewId;
  if (typeof reviewId !== "string" || !isValidObjectId(reviewId)) {
    throw new BadRequestException("Invalid review id");
  }

  const data = updateReviewSchema.parse(req.body);

  const review = await updateReviewService({
    reviewId,
    userId,
    role: role as RoleEnumType,
    data,
  });

  return res.status(HTTP_STATUS.OK).json({
    message: "Review updated successfully",
    review,
  });
});

export const deleteReviewController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  if (!userId || !role) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const reviewId = req.params.reviewId;
  if (typeof reviewId !== "string" || !isValidObjectId(reviewId)) {
    throw new BadRequestException("Invalid review id");
  }

  await deleteReviewService({
    reviewId,
    userId,
    role: role as RoleEnumType,
  });

  return res.status(HTTP_STATUS.OK).json({
    message: "Review deleted successfully",
  });
});
