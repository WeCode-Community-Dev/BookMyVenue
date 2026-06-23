import { FastifyInstance } from "fastify";
import { ownerAuthMiddleware } from "../middleware/authmiddleware.js";
import { VenueCategory, District } from "@bookmyvenue/database";
import { createVenue, CreateVenueBody } from "../controllers/venue.js";

const createVenueSchema = {
    body: {
        type: "object",
        required: ["name", "description", "capacity", "category", "location", "district"],
        properties: {
            name: { type: "string", minLength: 2 },
            description: { type: "string", minLength: 10 },
            capacity: { type: "integer", minimum: 1 },
            category: { type: "string", enum: Object.values(VenueCategory) },
            location: { type: "string", minLength: 2 },
            district: { type: "string", enum: Object.values(District) },
            images: { type: "array", items: { type: "string" }, default: [] },
            amenities: { type: "array", items: { type: "string" }, default: [] },
            sessions: {
                type: "array",
                items: {
                    type: "object",
                    required: ["label", "startTime", "endTime", "price"],
                    properties: {
                        label: { type: "string", minLength: 1 },
                        startTime: { type: "string" },
                        endTime: { type: "string" },
                        price: { type: "integer", minimum: 0 },
                    },
                },
                default: [],
            },
        },
    },
};

export const venueRoute = async (fastify: FastifyInstance) => {
    fastify.post<{ Body: CreateVenueBody }>(
        "/create-venue",
        { preHandler: ownerAuthMiddleware, schema: createVenueSchema },
        createVenue,
    );
};
