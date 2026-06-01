import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VenuesService } from './venues.service';
import { CloudinaryService } from './cloudinary.service';
import { VenuesController } from './venues.controller';
import { Venue } from './entities/venue.entity';
import { VenueBlockedDate } from './entities/venue-blocked-date.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venue, VenueBlockedDate, Booking]),
    ConfigModule,
  ],
  controllers: [VenuesController],
  providers: [VenuesService, CloudinaryService],
  exports: [VenuesService, CloudinaryService],
})
export class VenuesModule {}
