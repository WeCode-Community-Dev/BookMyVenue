import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/providers/redis/redis.service';

@Injectable()
export class IdempotencyService {
  constructor(private readonly redisService: RedisService) {}

  async getCachedResponse(
    idempotencyKey: string,
  ): Promise<Record<string, unknown> | null> {
    const redis = this.redisService.getClient();

    const cachedResponse = await redis.get(`idempotency:${idempotencyKey}`);

    if (!cachedResponse) {
      return null;
    }

    return JSON.parse(cachedResponse) as Record<string, unknown>;
  }

  async cacheResponse(
    idempotencyKey: string,
    response: Record<string, unknown>,
  ): Promise<void> {
    const redis = this.redisService.getClient();

    await redis.set(`idempotency:${idempotencyKey}`, JSON.stringify(response), {
      EX: 60 * 60, // Cache for 1 hour
    });
  }
}
