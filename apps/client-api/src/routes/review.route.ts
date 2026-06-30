import { FastifyInstance } from "fastify";
import { userAuthMiddleware } from "../middleware/authmiddleware.js";
import { createReview, getVenueReviewStatus } from "../controllers/review.controller.js";
import { CreateReviewBody } from "@bookmyvenue/types";
import { createReviewSchema } from "../schemas/review.schema.js";


export const reviewRoute = async (fastify: FastifyInstance) => {
    fastify.get<{ Params: { venueId: string } }>(
        "/:venueId/review-status",
        { preHandler: userAuthMiddleware },
        getVenueReviewStatus,
    );
};

export const reviewRoutes = (fastify: FastifyInstance) => {
    fastify.post<{ Body: CreateReviewBody }>(
        "/create-review",
        { preHandler: userAuthMiddleware, schema: createReviewSchema },
        createReview,
    );
};
