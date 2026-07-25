import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingService } from './booking.service';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiBearerAuth()
  @Roles(Role.USER)
  @Post()
  @ApiOperation({ summary: 'Create a booking for a slot' })
  async create(
    @Body() dto: CreateBookingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return {
      success: true,
      message: 'Booking created successfully.',
      data: await this.bookingService.create(dto, req.user.sub),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.USER)
  @Get('me')
  @ApiOperation({ summary: 'Get current user bookings' })
  async findMyBookings(@Req() req: AuthenticatedRequest) {
    return {
      success: true,
      data: await this.bookingService.findMyBookings(req.user.sub),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.OWNER)
  @Get('owner/overview')
  @ApiOperation({ summary: 'Get dashboard metrics overview for owner' })
  async getOwnerOverview(@Req() req: AuthenticatedRequest) {
    return {
      success: true,
      data: await this.bookingService.getOwnerOverview(req.user.sub),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.USER)
  @Get('me/:id')
  @ApiOperation({ summary: 'Get current user booking details' })
  async findMyBookingById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return {
      success: true,
      data: await this.bookingService.findMyBookingById(id, req.user.sub),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.USER)
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel current user booking' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return {
      success: true,
      message: 'Booking cancelled successfully.',
      data: await this.bookingService.cancel(id, req.user.sub),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.OWNER)
  @Get('owner/venues/:venueId')
  @ApiOperation({ summary: 'Get bookings for an owner venue' })
  async findOwnerVenueBookings(
    @Param('venueId', ParseUUIDPipe) venueId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return {
      success: true,
      data: await this.bookingService.findOwnerVenueBookings(
        venueId,
        req.user.sub,
      ),
    };
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('admin/all')
  @ApiOperation({ summary: 'Get all bookings for admin' })
  async findAllForAdmin() {
    return {
      success: true,
      data: await this.bookingService.findAllForAdmin(),
    };
  }
}