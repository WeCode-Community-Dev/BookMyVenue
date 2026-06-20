import { getAuth } from "@clerk/fastify";
// import type { CustomJwtSessionClaims } from "@repo/types";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
    interface FastifyRequest {
        userId?: string;
    }
}

export const userAuthMiddleware = async (request: FastifyRequest, reply: FastifyReply, next: () => void) => {
    const auth = getAuth(request);
    const userId = auth?.userId;
    if (!userId) {
        return reply.status(401).send({ message: "User not authenticated" });
    }
    request.userId = auth.userId;
    next();
};

// export const adminAuthMiddleware = async (request: FastifyRequest, reply: FastifyReply, next: () => void) => {
//     const auth = getAuth(request);
//     const userId = auth?.userId;
//     if (!userId) {
//         return reply.status(401).send({ message: "User not authenticated" });
//     }
//     const claims = auth.sessionClaims as CustomJwtSessionClaims;

//     if (claims.metadata?.role !== "admin") {
//         return reply.status(403).send({ message: "Unauthorized!" });
//     }

//     request.userId = auth.userId;
//     next();
// };
