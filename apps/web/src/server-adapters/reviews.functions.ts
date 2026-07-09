// Presentation/server adapter — Reviews

import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "@/lib/auth-middleware";
import { ReviewIdSchema, UpsertReviewSchema, VenueIdSchema } from "@repo/application/reviews";
import { buildServices } from "@/infrastructure/services";

export const listVenueReviews = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => VenueIdSchema.parse(input))
  .handler(({ data }) => buildServices().listVenueReviews(data.venueId));

export const canIReviewVenue = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => VenueIdSchema.parse(input))
  .handler(({ data, context }) =>
    buildServices({ db: context.db, userId: context.userId }).canIReviewVenue(
      context.userId,
      data.venueId,
    ),
  );

export const upsertMyReview = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => UpsertReviewSchema.parse(input))
  .handler(({ data, context }) =>
    buildServices({ db: context.db, userId: context.userId }).upsertMyReview(
      data,
      context.userId,
    ),
  );

export const deleteMyReview = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => ReviewIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    await buildServices({ db: context.db, userId: context.userId }).deleteMyReview(
      data.reviewId,
      context.userId,
    );
    return { ok: true as const };
  });
