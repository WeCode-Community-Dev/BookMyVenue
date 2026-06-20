import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { CreateBookingCommand } from '../../../core/application/bookings/commands/create-booking.command';
import { CancelBookingCommand } from '../../../core/application/bookings/commands/cancel-booking.command';
import { GetUserBookingsQuery } from '../../../core/application/bookings/queries/get-user-bookings.query';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { InfraModule } from '../../../infra/infra.module';
import { GetBookingsByVenueQuery } from 'src/core/application/bookings/queries/get-venue-bookings.query';
import { GetBookingsByOwnerQuery } from 'src/core/application/bookings/queries/get-bookings-for-owner.query';
import { GetBookingDetailsQuery } from 'src/core/application/bookings/queries/get-booking-details.query';

@Module({
  imports: [InfraModule],
  controllers: [BookingsController],
  providers: [
    CreateBookingCommand,
    CancelBookingCommand,
    GetUserBookingsQuery,
    JwtAuthGuard,
    GetBookingsByVenueQuery,
    GetBookingsByOwnerQuery,
    GetBookingDetailsQuery
  ],
})
export class BookingsModule { }
