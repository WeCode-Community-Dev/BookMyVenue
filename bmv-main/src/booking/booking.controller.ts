import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../guard/jwt.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './booking.dto/create.dto';

@ApiTags('Booking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  // Get user bookings
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get my bookings',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully.',
  })
  getMyBookings(@Req() req) {
    return this.bookingService.getMyBookings(req.user.userId);
  }
  // Get booking details
  @Get(':bookingId')
  @UseGuards(JwtAuthGuard)             
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get booking details',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking details retrieved successfully.',
  })
  getBookingDetails(@Param('bookingId') bookingId: string, @Req() req) {
    return this.bookingService.getBookingDetails(bookingId, req.user.userId);
  }

@Post()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({
  summary: 'Create a new booking',
})
createBooking(
  @Body() createBookingDto: CreateBookingDto,
  @Req() req,
) {
  return this.bookingService.createBooking(
    createBookingDto,
    req.user.id,
  );
}
}
