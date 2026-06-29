import { FastifyInstance } from "fastify";
import { userAuthMiddleware } from "../middleware/authmiddleware.js";
import { GetVenueReviewStatusQuery } from "@bookmyvenue/types";
import { getVenueReviewStatus } from "../controllers/reviewController.js";

export const reviewRoute = async (fastify: FastifyInstance) => {
    fastify.get<{ Params: { venueId: string } }>(
        "/:venueId/review-status",
        { preHandler: userAuthMiddleware },
        getVenueReviewStatus,
    );
};
