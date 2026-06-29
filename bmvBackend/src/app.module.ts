import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { VenuesModule } from './venues/venues.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { BookingModule } from './venues/booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: 'otp', ttl: 60_000, limit: 3 },
      { name: 'login', ttl: 60_000, limit: 10 },
    ]),
    ScheduleModule.forRoot(),
    CloudinaryModule,
    AuthModule,
    DbModule,
    UsersModule,
    VenuesModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

