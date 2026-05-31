import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

import { createRedisClient } from "./infrastructure/cache/redis.js";
import { createServer } from "./infrastructure/http/server.js";

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  const redis = createRedisClient();

  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    await redis.ping();
    console.log("✅ Redis connected");

    const app = createServer({ prisma, redis });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      console.log("\n🔄 Shutting down gracefully...");
      await prisma.$disconnect();
      redis.disconnect();
      process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
