import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { VenueModule } from './modules/venues/venues.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    VenueModule,
    BookingsModule,
    PrismaModule,
  ],
})
export class AppModule {}
