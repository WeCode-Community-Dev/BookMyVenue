import { FastifyInstance } from "fastify";
import { ownerAuthMiddleware } from "../middleware/authmiddleware.js";

export const venueRoute = async (fastify: FastifyInstance) => {
    fastify.get("/protected", {preHandler: ownerAuthMiddleware}, async (request, replay) => {
        return replay.send({message: "Owner authenticated"})
    })
}
