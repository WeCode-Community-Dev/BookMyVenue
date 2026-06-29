import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingLocksService } from './booking-locks.service';
import { BookingLocksController } from './booking-locks.controller';
import { BookingLock } from './entities/booking-lock.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Venue } from '../venues/entities/venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingLock, Booking, Venue])],
  controllers: [BookingLocksController],
  providers: [BookingLocksService],
  exports: [BookingLocksService],
})
export class BookingLocksModule {}
