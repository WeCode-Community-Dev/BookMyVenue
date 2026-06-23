import { Controller, Post, Body, Req, Delete, Param, Get } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthenticatedRequest } from '../auth/types/authenticated-request.type';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    const booking = await this.bookingService.createBooking(createBookingDto, userId);
    return { success: true, message: 'Venue booked successfully!', data: booking };
  }

  @Post(':id/cancel')
  async cancel(@Param('id') bookingId: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    await this.bookingService.cancelBooking(bookingId, userId);
    return { success: true, message: 'Booking cancelled successfully. Refund processed.' };
  }
  @Get()
  async findAllMyBookings(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    const bookings = await this.bookingService.getUserBookings(userId);
    return { success: true, message: 'Bookings retrieved successfully.', data: bookings };
  }
}