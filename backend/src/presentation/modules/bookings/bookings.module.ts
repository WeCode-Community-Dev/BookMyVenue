import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { CreateBookingCommand } from '../../../core/application/bookings/commands/create-booking.command';
import { CancelBookingCommand } from '../../../core/application/bookings/commands/cancel-booking.command';
import { GetUserBookingsQuery } from '../../../core/application/bookings/queries/get-user-bookings.query';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { InfraModule } from '../../../infra/infra.module';

@Module({
  imports: [InfraModule],
  controllers: [BookingsController],
  providers: [
    CreateBookingCommand,
    CancelBookingCommand,
    GetUserBookingsQuery,
    JwtAuthGuard,
  ],
})
export class BookingsModule {}
