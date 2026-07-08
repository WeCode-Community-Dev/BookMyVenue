import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './providers/mail/mail.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from './providers/prisma/prisma.module';
import { RedisModule } from './providers/redis/redis.module';
import { VenueModule } from './venue/venue.module';

@Module({
  imports: [PrismaModule, RedisModule, MailModule, AuthModule, VenueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
