import { FastifyInstance } from "fastify";
import { userAuthMiddleware } from "../middleware/authmiddleware.js";
import { writeReview, getVenueReviewStatus, getReviews } from "../controllers/review.controller.js";
import { WriteReviewBody, GetReviewsQuery } from "@bookmyvenue/types";
import { writeReviewSchema } from "../schemas/review.schema.js";

export const reviewRoute = async (fastify: FastifyInstance) => {
    fastify.get<{ Params: { venueId: string } }>(
        "/:venueId/review-status",
        { preHandler: userAuthMiddleware },
        getVenueReviewStatus,
    );

    fastify.get<{ Params: { venueId: string }; Querystring: GetReviewsQuery }>(
        "/:venueId/reviews",
        getReviews,
    );

    fastify.post<{ Body: WriteReviewBody }>(
        "/write-review",
        { preHandler: userAuthMiddleware, schema: writeReviewSchema },
        writeReview,
    );
};
