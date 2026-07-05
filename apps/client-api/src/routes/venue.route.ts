import { FastifyInstance } from "fastify";
import { ownerAuthMiddleware } from "../middleware/authmiddleware.js";
import {
    createVenue,
    getVenues,
    getVenueById,
    editVenue,
    getVenuesByOwnerId,
    deleteVenue,
} from "../controllers/venue.controller.js";
import { CreateVenueBody, EditVenueBody, GetVenuesQuery } from "@bookmyvenue/types";
import { createVenueSchema, editVenueSchema, getVenuesSchema } from "../schemas/venue.schema.js";

export const venueRoute = async (fastify: FastifyInstance) => {
    fastify.get<{ Querystring: GetVenuesQuery }>("/", { schema: getVenuesSchema }, getVenues);

    fastify.get<{ Querystring: GetVenuesQuery }>(
        "/owner-venues",
        { preHandler: ownerAuthMiddleware, schema: getVenuesSchema },
        getVenuesByOwnerId,
    );

    fastify.get<{ Params: { id: string } }>("/:id", getVenueById);

    fastify.post<{ Body: CreateVenueBody }>(
        "/create-venue",
        { preHandler: ownerAuthMiddleware, schema: createVenueSchema },
        createVenue,
    );

    fastify.put<{ Params: { id: string }; Body: EditVenueBody }>(
        "/:id",
        { preHandler: ownerAuthMiddleware, schema: editVenueSchema },
        editVenue,
    );

    fastify.delete<{ Params: { venueId: string } }>(
        "/:venueId",
        { preHandler: ownerAuthMiddleware },
        deleteVenue,
    );
};
