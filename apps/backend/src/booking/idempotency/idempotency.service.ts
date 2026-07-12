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

    const parsed = JSON.parse(cachedResponse) as Record<string, unknown>;

    return parsed;
  }
}
