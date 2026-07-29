import { Redis } from '@upstash/redis';
import env from '../configs/env.config';
import logger from '@/libs/logger';

const client = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

logger.info('[Redis] Redis client initialized');

export const redisService = {
  async get(key: string): Promise<string | null> {
    const val = await client.get<string | number>(key);
    return val !== null && val !== undefined ? String(val) : null;
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await client.set(key, value, { ex: ttlSeconds });
    } else {
      await client.set(key, value);
    }
  },

  async del(key: string): Promise<void> {
    await client.del(key);
  },

  async incr(key: string): Promise<number> {
    return client.incr(key);
  },

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await client.expire(key, ttlSeconds);
  },

  async ttl(key: string): Promise<number> {
    return client.ttl(key);
  },
};
