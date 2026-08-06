import { FastifyError, FastifyInstance } from "fastify";
import { Prisma } from "@bookmyvenue/database";
import { AppError } from "../utils/errors";

export const registerErrorHandler = (app: FastifyInstance) => {
    app.setErrorHandler((error: FastifyError, request, reply) => {
        if (error instanceof AppError) {
            return reply.status(error.statusCode).send({ message: error.message });
        }

        if (error.validation) {
            return reply.status(400).send({ message: error.message });
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case "P2002":
                    return reply.status(409).send({ message: "Resource already exists" });

                case "P2025":
                    return reply.status(404).send({ message: "Resource not found" });
            }
        }

        request.log.error(
            { err: error, method: request.method, url: request.url },
            "Unhandled request error",
        );

        return reply.status(500).send({ message: "Internal server error" });
    });
};
