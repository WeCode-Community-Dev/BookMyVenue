// Application layer — Reviews use-cases & schemas

import { z } from "zod";
import { canReviewVenue, isValidRating, type Review } from "@repo/domain/reviews";
import type { ReviewsRepo, ReviewSummary } from "@repo/contracts";

export const VenueIdSchema = z.object({ venueId: z.string().uuid() });

export const UpsertReviewSchema = z.object({
  venueId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  feedback: z.string().trim().max(2000).optional().nullable(),
});
export type UpsertReviewInput = z.infer<typeof UpsertReviewSchema>;

export const ReviewIdSchema = z.object({ reviewId: z.string().uuid() });

export interface ReviewEligibility {
  eligible: boolean;
  existingReview: Pick<Review, "id" | "rating" | "feedback"> | null;
}

export const listVenueReviewsUseCase =
  (repo: ReviewsRepo) =>
  (venueId: string): Promise<ReviewSummary> =>
    repo.listForVenue(venueId);

export const canIReviewVenueUseCase =
  (repo: ReviewsRepo) =>
  async (userId: string, venueId: string): Promise<ReviewEligibility> => {
    const [hasBooking, existing] = await Promise.all([
      repo.hasConfirmedBooking(userId, venueId),
      repo.findByUserAndVenue(userId, venueId),
    ]);
    return {
      eligible: canReviewVenue(hasBooking),
      existingReview: existing
        ? { id: existing.id, rating: existing.rating, feedback: existing.feedback }
        : null,
    };
  };

export const upsertMyReviewUseCase =
  (repo: ReviewsRepo) =>
  async (input: UpsertReviewInput, userId: string): Promise<Review> => {
    if (!isValidRating(input.rating)) throw new Error("Rating must be 1–5");
    const eligible = await repo.hasConfirmedBooking(userId, input.venueId);
    if (!canReviewVenue(eligible)) {
      throw new Error("You can only review venues you have a confirmed booking at");
    }
    return repo.upsert({
      userId,
      venueId: input.venueId,
      rating: input.rating,
      feedback: input.feedback ?? null,
    });
  };

export const deleteMyReviewUseCase =
  (repo: ReviewsRepo) =>
  (reviewId: string, userId: string): Promise<void> =>
    repo.deleteByOwner(reviewId, userId);
