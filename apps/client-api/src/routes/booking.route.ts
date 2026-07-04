import { FastifyInstance } from "fastify";
import { userAuthMiddleware, ownerAuthMiddleware } from "../middleware/authmiddleware.js";
import {
    createBooking,
    getBookingByUserId,
    getBookingsByOwnerId,
    getOwnerDashboard,
} from "../controllers/booking.controller.js";
import type { CreateBookingBody, GetOwnerBookingQuery, GetUserBookingQuery } from "@bookmyvenue/types";
import { createBookingSchema, getBookingsByIdSchema } from "../schemas/booking.schema.js";

export const bookingRoute = async (fastify: FastifyInstance) => {
    fastify.post<{ Body: CreateBookingBody }>(
        "/create-booking",
        { preHandler: userAuthMiddleware, schema: createBookingSchema },
        createBooking,
    );
    fastify.get<{ Querystring: GetOwnerBookingQuery }>(
        "/owner/bookings",
        { preHandler: ownerAuthMiddleware, schema: getBookingsByIdSchema },
        getBookingsByOwnerId,
    );
    fastify.get("/owner/dashboard", { preHandler: ownerAuthMiddleware }, getOwnerDashboard);
    fastify.get<{ Querystring: GetUserBookingQuery & { today: string } }>(
        "/user/bookings",
        { preHandler: userAuthMiddleware, schema: getBookingsByIdSchema },
        getBookingByUserId,
    );
};
