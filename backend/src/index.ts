// import "dotenv/config";
// import cors from "cors";
// import express from "express";

// import { prisma } from "./config/db.js";
// import { redis } from "./config/redis.js";
// import { errorHandler } from "./middleware/errorHandler.js";
// import routes from "./routes/index.js";

// const PORT = 3001;

// async function main() {
//   try {
//     await prisma.$connect();
//     console.log("✅ Database connected");

//     await redis.ping();
//     console.log("✅ Redis connected");

//     const app = express();

//     app.use(cors());
//     app.use(express.json());

//     app.use("/api", routes);

//     app.use(errorHandler);

//     const server = app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });

//     const shutdown = async () => {
//       console.log("\n🔄 Shutting down gracefully...");
//       server.close();
//       await prisma.$disconnect();
//       redis.disconnect();
//       process.exit(0);
//     };

//     process.on("SIGTERM", shutdown);
//     process.on("SIGINT", shutdown);
//   } catch (error) {
//     console.error("❌ Failed to start server:", error);
//     await prisma.$disconnect();
//     process.exit(1);
//   }
// }

// main();

// new code for redis connection
import "dotenv/config";
import cors from "cors";
import express from "express";

import { prisma } from "./config/db.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

const PORT = 3001;

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    const redisConnected = await connectRedis();
    if (redisConnected) {
      console.log("✅ Redis connected");
    } else {
      console.warn("⚠️ Redis not connected - continuing without Redis");
    }

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use("/api", routes);

    app.use(errorHandler);

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      console.log("\n🔄 Shutting down gracefully...");

      server.close();
      await prisma.$disconnect();

      disconnectRedis();

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

main();
