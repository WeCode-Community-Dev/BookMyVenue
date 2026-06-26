import { FastifyInstance } from "fastify";
import { userAuthMiddleware } from "../middleware/authmiddleware.js";
import { createBooking } from "../controllers/bookingController.js";
import type { CreateBookingBody } from "@bookmyvenue/types";

const createBookingSchema = {
    body: {
        type: "object",
        required: ["venueId", "sessionIds", "eventDate", "phone"],
        properties: {
            venueId: { type: "integer", minimum: 1 },
            sessionIds: {
                type: "array",
                items: { type: "integer", minimum: 1 },
                minItems: 1,
                uniqueItems: true,
            },
            eventDate: { type: "string", format: "date" },
            phone: { type: "string", minLength: 10 },
            purpose: { type: "string" },
        },
    },
};

export const bookingRoute = async (fastify: FastifyInstance) => {
    fastify.post<{ Body: CreateBookingBody }>(
        "/create-booking",
        { preHandler: userAuthMiddleware, schema: createBookingSchema },
        createBooking,
    );
};
