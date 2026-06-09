import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis(configService.getOrThrow<string>('REDIS_URL'));
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}