import { FastifyInstance } from "fastify";
import { userAuthMiddleware, ownerAuthMiddleware } from "../middleware/authmiddleware.js";
import { createBooking, getBookingsByOwnerId } from "../controllers/bookingController.js";
import type { CreateBookingBody, GetBookingQuery } from "@bookmyvenue/types";
import { BookingStatus } from "@bookmyvenue/database";

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

const getBookingsByIdSchema = {
    querystring: {
        type: "object",
        properties: {
            status: { type: "string", enum: Object.values(BookingStatus) },
            page: { type: "integer", minimum: 1, default: 1 },
            limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
        },
    },
};

export const bookingRoute = async (fastify: FastifyInstance) => {
    fastify.post<{ Body: CreateBookingBody }>(
        "/create-booking",
        { preHandler: userAuthMiddleware, schema: createBookingSchema },
        createBooking,
    );
    fastify.get<{ Querystring: GetBookingQuery }>(
        "/owner/bookings",
        { preHandler: ownerAuthMiddleware, schema: getBookingsByIdSchema },
        getBookingsByOwnerId,
    );
};
