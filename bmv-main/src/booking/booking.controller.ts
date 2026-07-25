import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { ReviewOwnerBookingDto } from './booking.dto/review-owner-booking.dto';

@ApiTags('Booking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('my')
  @ApiOperation({ summary: 'Get my bookings' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully.' })
  getMyBookings(@Req() req) {
    return this.bookingService.getMyBookings(req.user.userId);
  }

  @Get('owner/requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENUE_OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Get booking requests waiting for venue owner approval' })
  getOwnerBookingRequests(@Req() req) {
    return this.bookingService.getOwnerBookingRequests(req.user.userId);
  }

  @Get(':bookingId')
  @ApiOperation({ summary: 'Get booking details' })
  @ApiResponse({ status: 200, description: 'Booking details retrieved successfully.' })
  getBookingDetails(@Param('bookingId') bookingId: string, @Req() req) {
    return this.bookingService.getBookingDetails(bookingId, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  createBooking(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    return this.bookingService.createBooking(createBookingDto, req.user.userId);
  }

  @Patch('owner/requests/:bookingId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENUE_OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Approve a booking request as the venue owner' })
  approveOwnerBookingRequest(@Param('bookingId') bookingId: string, @Req() req) {
    return this.bookingService.approveOwnerBookingRequest(bookingId, req.user.userId);
  }

  @Patch('owner/requests/:bookingId/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENUE_OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Reject a booking request as the venue owner' })
  rejectOwnerBookingRequest(@Param('bookingId') bookingId: string, @Body() dto: ReviewOwnerBookingDto, @Req() req) {
    return this.bookingService.rejectOwnerBookingRequest(bookingId, req.user.userId, dto);
  }
}
