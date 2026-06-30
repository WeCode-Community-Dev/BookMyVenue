import { FastifyInstance } from "fastify";
import { userAuthMiddleware } from "../middleware/authmiddleware.js";
import { createReview, getVenueReviewStatus } from "../controllers/review.controller.js";
import { CreateReviewBody } from "@bookmyvenue/types";

const createReviewSchema = {
    body: {
        type: "object",
        required: ["venueId", "rating"],
        additionalProperties: false,
        properties: {
            venueId: { type: "integer", minimum: 1 },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string", minLength: 10, maxLength: 500 },
        },
    },
};

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
