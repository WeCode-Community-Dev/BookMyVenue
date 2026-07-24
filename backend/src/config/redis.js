import { createClient } from "redis";

let redisClient = null;

const connectRedis = async () => {
  try {
    if (!redisClient) {
      redisClient = createClient({
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        },
      });

      redisClient.on("error", (err) => {
        console.error("Redis Client Error:", err);
      });
    }

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Redis connection failed:", error);
  }
};

export { connectRedis, redisClient };
export { redisClient as default };
