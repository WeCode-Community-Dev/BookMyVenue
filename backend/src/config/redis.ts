import Redis from "ioredis";

let client: Redis | null = null;

export async function connectRedis(): Promise<boolean> {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return false;
  }

  const redis = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
    enableOfflineQueue: false,
  });

  redis.on("error", () => {
    // Redis is optional; suppress connection error noise
  });

  try {
    await redis.connect();
    await redis.ping();
    client = redis;
    return true;
  } catch {
    redis.disconnect();
    return false;
  }
}

export function disconnectRedis(): void {
  if (client) {
    client.disconnect();
    client = null;
  }
}

export function getRedis(): Redis | null {
  return client;
}
