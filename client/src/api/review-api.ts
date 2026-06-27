import { apiClient } from "@/lib/axios-client";
import type { Review } from "@/types/review.types";

export const getVenueReviews = async (venueId: string): Promise<Review[]> => {
  const { data } = await apiClient.get(`/review/venue/${venueId}`);
  return data.reviews;
};

export const createReviewRequest = async (payload: {
  venueId: string;
  rating: number;
  comment: string;
}): Promise<Review> => {
  const { data } = await apiClient.post("/review/create", payload);
  return data.review;
};

export const updateReviewRequest = async (payload: {
  reviewId: string;
  rating: number;
  comment: string;
}): Promise<Review> => {
  const { data } = await apiClient.patch(`/review/update/${payload.reviewId}`, {
    rating: payload.rating,
    comment: payload.comment,
  });
  return data.review;
};

export const deleteReviewRequest = async (reviewId: string): Promise<void> => {
  await apiClient.delete(`/review/delete/${reviewId}`);
};
