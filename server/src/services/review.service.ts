import ReviewModel from "../models/review.model";
import { getVenueByIdService } from "./venue.service";
import { HttpException } from "../utils/appError";
import { HTTP_STATUS } from "../config/http.config";
import { CreateReviewInput } from "../validator/review.validator";

type CreateReviewParams = CreateReviewInput & {
  customer: string;
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
