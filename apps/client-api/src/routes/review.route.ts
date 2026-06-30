import { FastifyInstance } from "fastify";
import { userAuthMiddleware } from "../middleware/authmiddleware.js";
import { writeReview, getVenueReviewStatus, getVenueReviews } from "../controllers/review.controller.js";
import { WriteReviewBody } from "@bookmyvenue/types";
import { writeReviewSchema } from "../schemas/review.schema.js";

export const reviewRoute = async (fastify: FastifyInstance) => {
    fastify.get<{ Params: { venueId: string } }>(
        "/:venueId/review-status",
        { preHandler: userAuthMiddleware },
        getVenueReviewStatus,
    );

    fastify.get<{ Params: { venueId: string } }>("/:venueId/reviews", getVenueReviews);

    fastify.post<{ Body: WriteReviewBody }>(
        "/write-review",
        { preHandler: userAuthMiddleware, schema: writeReviewSchema },
        writeReview,
    );
};
