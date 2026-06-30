// Drizzle implementation of ReviewsRepo

import { eq, and, desc } from "drizzle-orm";
import type { Review } from "@repo/domain/reviews";
import type { ReviewsRepo, ReviewSummary } from "@repo/contracts";
import { venueReviews, profiles, bookings } from "./schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapReview(r: any): Review {
  return {
    id: r.id,
    venue_id: r.venueId,
    user_id: r.userId,
    rating: r.rating,
    feedback: r.feedback ?? null,
    created_at: r.createdAt,
    updated_at: r.updatedAt,
  };
}

export function makeReviewsRepo(deps: { adminDb: any; userDb?: any }): ReviewsRepo {
  const { adminDb, userDb } = deps;
  const db = userDb ?? adminDb;

  return {
    async listForVenue(venueId): Promise<ReviewSummary> {
      const rows = await adminDb
        .select({
          id: venueReviews.id,
          userId: venueReviews.userId,
          rating: venueReviews.rating,
          feedback: venueReviews.feedback,
          createdAt: venueReviews.createdAt,
          updatedAt: venueReviews.updatedAt,
          profile: {
            firstName: profiles.firstName,
            lastName: profiles.lastName,
          },
        })
        .from(venueReviews)
        .leftJoin(profiles, eq(venueReviews.userId, profiles.id))
        .where(eq(venueReviews.venueId, venueId))
        .orderBy(desc(venueReviews.createdAt));

      const reviews = rows.map((r: any) => ({
        id: r.id,
        user_id: r.userId,
        rating: r.rating,
        feedback: r.feedback ?? null,
        created_at: r.createdAt,
        updated_at: r.updatedAt,
        reviewer_name:
          [r.profile?.firstName, r.profile?.lastName].filter(Boolean).join(" ") || "Guest",
      }));

      const average = reviews.length
        ? reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviews.length
        : 0;

      return { reviews, average, count: reviews.length };
    },

    async hasConfirmedBooking(userId, venueId) {
      const rows = await adminDb
        .select({ id: bookings.id })
        .from(bookings)
        .where(
          and(
            eq(bookings.customerId, userId),
            eq(bookings.venueId, venueId),
            eq(bookings.status, "confirmed"),
          ),
        )
        .limit(1);
      return rows.length > 0;
    },

    async findByUserAndVenue(userId, venueId): Promise<Review | null> {
      const rows = await adminDb
        .select()
        .from(venueReviews)
        .where(and(eq(venueReviews.userId, userId), eq(venueReviews.venueId, venueId)))
        .limit(1);
      return rows[0] ? mapReview(rows[0]) : null;
    },

    async upsert({ userId, venueId, rating, feedback }): Promise<Review> {
      const id = crypto.randomUUID();
      await db
        .insert(venueReviews)
        .values({
          id,
          venueId,
          userId,
          rating,
          feedback,
        })
        .onConflictDoUpdate({
          target: [venueReviews.venueId, venueReviews.userId],
          set: {
            rating,
            feedback,
            updatedAt: new Date().toISOString(),
          },
        });

      const rows = await db
        .select()
        .from(venueReviews)
        .where(and(eq(venueReviews.userId, userId), eq(venueReviews.venueId, venueId)))
        .limit(1);
      return mapReview(rows[0]);
    },

    async deleteByOwner(reviewId, userId) {
      await db
        .delete(venueReviews)
        .where(and(eq(venueReviews.id, reviewId), eq(venueReviews.userId, userId)));
    },

    async deleteAsAdmin(reviewId) {
      await adminDb.delete(venueReviews).where(eq(venueReviews.id, reviewId));
    },
  };
}
