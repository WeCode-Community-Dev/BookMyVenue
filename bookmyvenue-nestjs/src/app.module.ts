import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './shared/redis/redis.module';
import { JwtModule } from './shared/jwt/jwt.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { VenueModule } from './modules/venue/venue.module';
import { BookingModule } from './modules/booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    JwtModule,
    UserModule,
    AuthModule,
    VenueModule,
    BookingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }