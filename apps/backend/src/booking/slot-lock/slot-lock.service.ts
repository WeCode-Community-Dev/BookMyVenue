import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/providers/redis/redis.service';

@Injectable()
export class SlotLockService {
  constructor(private readonly redisService: RedisService) {}

  private buildKey(
    venueId: string,
    slotPricingTierId: string,
    eventDate: string,
  ): string {
    return `slot-lock:${venueId}:${slotPricingTierId}:${eventDate}`;
  }

  async acquireLock(
    venueId: string,
    slotPricingTierId: string,
    eventDate: string,
  ): Promise<boolean> {
    const redis = this.redisService.getClient();

    const key = this.buildKey(venueId, slotPricingTierId, eventDate);

    const result = await redis.set(key, 'locked', {
      NX: true,
      EX: 600,
    });

    return result === 'OK';
  }

  async releaseLock(
    venueId: string,
    slotPricingTierId: string,
    eventDate: string,
  ): Promise<void> {
    const redis = this.redisService.getClient();

    const key = this.buildKey(venueId, slotPricingTierId, eventDate);

    await redis.del(key);
  }

  async isLocked(
    venueId: string,
    slotPricingTierId: string,
    eventDate: string,
  ): Promise<boolean> {
    const redis = this.redisService.getClient();

    const key = this.buildKey(venueId, slotPricingTierId, eventDate);

    const exists = await redis.exists(key);

    return exists === 1;
  }
}
