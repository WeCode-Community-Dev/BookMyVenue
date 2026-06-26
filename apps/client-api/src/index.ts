import Fastify from "fastify";
import cors from "@fastify/cors";
import { clerkPlugin } from "@clerk/fastify";
import { venueRoute } from "./routes/venueRoute";
import { bookingRoute } from "./routes/bookingRoute";

const app = Fastify({ logger: true });
app.register(cors, { origin: true });
app.register(clerkPlugin);

app.register(venueRoute, { prefix: "/venue" });
app.register(bookingRoute, { prefix: "/booking" });


app.get("/health", async () => ({ status: "ok", uptime: process.uptime() }));

const start = async () => {
    try {
        await app.listen({ port: Number(process.env.PORT ?? 4000), host: "0.0.0.0" });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
