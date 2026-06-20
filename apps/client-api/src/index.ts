import Fastify from "fastify";
import { clerkPlugin } from "@clerk/fastify";
import { clerkClient, getAuth } from "@clerk/fastify";
import { userAuthMiddleware } from "./middleware/authmiddleware.js";

const app = Fastify({ logger: true });
app.register(clerkPlugin);

app.get("/health", async () => ({ status: "ok" }));

// auth test
app.get("/protected", { preHandler: userAuthMiddleware }, (request, reply) => {
    try {
        return reply.send({
            message: "User retrieved successfully",
            userId: request.userId,
        });
    } catch (error) {
        app.log.error(error);
        return reply.code(500).send({ error: "Failed to retrieve user" });
    }
});

try {
    await app.listen({ port: Number(process.env.PORT ?? 4000), host: "0.0.0.0" });
} catch (err) {
    app.log.error(err);
    process.exit(1);
}
