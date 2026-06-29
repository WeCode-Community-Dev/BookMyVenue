import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Venue } from '../entities/venue.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { VenueBlockedDate } from '../entities/venue-blocked-date.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Booking, Venue, VenueBlockedDate])],
    controllers: [BookingController],
    providers: [BookingService],
})
export class BookingModule { }

