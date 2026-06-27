import ReviewModel from "../models/review.model";
import { getVenueByIdService } from "./venue.service";
import { ForbiddenException, HttpException, NotFoundException } from "../utils/appError";
import { HTTP_STATUS } from "../config/http.config";
import { RoleEnum, RoleEnumType } from "../enums/user-enum";
import { CreateReviewInput, UpdateReviewInput } from "../validator/review.validator";

type CreateReviewParams = CreateReviewInput & {
  customer: string;
};

type UpdateReviewParams = {
  reviewId: string;
  userId: string;
  role: RoleEnumType;
  data: UpdateReviewInput;
};

type DeleteReviewParams = {
  reviewId: string;
  userId: string;
  role: RoleEnumType;
};

export const createReviewService = async ({
  venueId,
  rating,
  comment,
  customer,
}: CreateReviewParams) => {
  // Check venue exist or not
  await getVenueByIdService(venueId);

  const existingReview = await ReviewModel.findOne({ venue: venueId, customer });
  if (existingReview) {
    throw new HttpException("You have already reviewed this venue", HTTP_STATUS.CONFLICT);
  }

  const review = await ReviewModel.create({
    venue: venueId,
    customer,
    rating,
    comment,
  });

  return review;
};

export const getVenueReviewsService = async (venueId: string) => {
  await getVenueByIdService(venueId);

  const reviews = await ReviewModel.find({ venue: venueId })
    .populate("customer", "name")
    .sort({ createdAt: -1 });

  return reviews;
};

export const updateReviewService = async ({ reviewId, userId, role, data }: UpdateReviewParams) => {
  const review = await ReviewModel.findById(reviewId);
  if (!review) {
    throw new NotFoundException("Review not found");
  }

  const isOwner = review.customer.toString() === userId;
  const isAdmin = role === RoleEnum.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new ForbiddenException("You can only update your own review");
  }

  Object.assign(review, data);
  await review.save();

  return review;
};

export const deleteReviewService = async ({ reviewId, userId, role }: DeleteReviewParams) => {
  const review = await ReviewModel.findById(reviewId);
  if (!review) {
    throw new NotFoundException("Review not found");
  }

  const isOwner = review.customer.toString() === userId;
  const isAdmin = role === RoleEnum.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new ForbiddenException("You can only delete your own review");
  }

  await review.deleteOne();

  return review;
};
