import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateBookingCommand } from '../../../core/application/bookings/commands/create-booking.command';
import { CancelBookingCommand } from '../../../core/application/bookings/commands/cancel-booking.command';
import { GetUserBookingsQuery } from '../../../core/application/bookings/queries/get-user-bookings.query';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { type TokenPayload } from '../../../core/application/users/services/token.interface';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { createBookingSchema } from '../../validation/bookings/create-booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RolesGuard } from 'src/presentation/guards/roles.guard';
import { Roles } from 'src/presentation/decorators/roles.decorator';
import { UserRole } from 'src/core/domain/_shared/enum/UserRole';
import { GetBookingsByVenueQuery } from 'src/core/application/bookings/queries/get-venue-bookings.query';
import { GetBookingsByOwnerQuery } from 'src/core/application/bookings/queries/get-bookings-for-owner.query';
import { GetBookingDetailsQuery } from 'src/core/application/bookings/queries/get-booking-details.query';

@ApiTags('bookings')
@Controller({
  version: '1',
  path: 'bookings',
})
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(
    private readonly createBookingCommand: CreateBookingCommand,
    private readonly cancelBookingCommand: CancelBookingCommand,
    private readonly getUserBookingsQuery: GetUserBookingsQuery,
    private readonly getBookingsByVenueQuery: GetBookingsByVenueQuery,
    private readonly getBookingsByOwnerQuery: GetBookingsByOwnerQuery,
    private readonly getBookingDetailsQuery: GetBookingDetailsQuery,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  create(
    @CurrentUser() user: TokenPayload,
    @Body(new ZodValidationPipe(createBookingSchema as any)) data: CreateBookingDto,
  ) {
    return this.createBookingCommand.execute({
      userId: user.userId,
      ...data,
    });
  }

  @Get(':bookingId')
  @Roles(UserRole.USER, UserRole.VENUE_OWNER)
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  getBookingDetails(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.getBookingDetailsQuery.execute({
      bookingId,
      userId: user.userId,
      role: user.role
    });
  }

  @Get('user/my-bookings')
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  findMine(@CurrentUser() user: TokenPayload) {
    return this.getUserBookingsQuery.execute(user.userId);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  cancel(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    return this.cancelBookingCommand.execute({
      bookingId: id,
      userId: user.userId,
      userRole: user.role,
    });
  }

  @Get('owner/all-bookings')
  @Roles(UserRole.VENUE_OWNER)
  @ApiOperation({ summary: 'LIst All bookings for all venues (Venue Owner only)' })
  getBookingForOwner(@CurrentUser() user: TokenPayload) {
    return this.getBookingsByOwnerQuery.execute(user.userId)
  }

  @Get('venues/:venueId')
  @Roles(UserRole.VENUE_OWNER)
  @ApiOperation({ summary: 'LIst bookings by venueId (Venue Owner only)' })
  getBookingByVenueId(
    @Param('venueId', ParseUUIDPipe) venueId: string,
    @CurrentUser() user: TokenPayload
  ) {
    return this.getBookingsByVenueQuery.execute(venueId, user.userId)
  }
}
