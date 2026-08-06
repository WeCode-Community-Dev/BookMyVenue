import { FastifyInstance } from "fastify";
import {  ownerAuthMiddleware } from "../middleware/authmiddleware.js";
import { getOwnerDashboard } from "../controllers/booking.controller.js";

export const dashboardRoute = async (fastify: FastifyInstance) => {
    fastify.get("/dashboard", { preHandler: ownerAuthMiddleware }, getOwnerDashboard);
};
