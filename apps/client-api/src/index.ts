import Fastify from "fastify";
import { clerkPlugin } from "@clerk/fastify";
import { userAuthMiddleware } from "./middleware/authmiddleware.js";
import { prisma } from "@bookmyvenue/database";

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

app.post("/users", { preHandler: userAuthMiddleware }, async (request, reply) => {
    try {
        const { email, role } = request.body as { email: string; role?: "ADMIN" | "OWNER" | "USER" };

        if (!email) {
            return reply.code(400).send({ error: "email is required" });
        }

        const user = await prisma.user.create({
            data: { email, ...(role && { role }) },
        });

        return reply.code(201).send({ message: "User created successfully", user });
    } catch (error: any) {
        if (error?.code === "P2002") {
            return reply.code(409).send({ error: "User with this email already exists" });
        }
        app.log.error(error);
        return reply.code(500).send({ error: "Failed to create user" });
    }
});

try {
    await app.listen({ port: Number(process.env.PORT ?? 4000), host: "0.0.0.0" });
} catch (err) {
    app.log.error(err);
    process.exit(1);
}
