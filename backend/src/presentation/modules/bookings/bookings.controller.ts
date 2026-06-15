import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
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

@ApiTags('bookings')
@Controller('bookings')
@ApiBearerAuth('JWT-auth')
export class BookingsController {
  constructor(
    private readonly createBookingCommand: CreateBookingCommand,
    private readonly cancelBookingCommand: CancelBookingCommand,
    private readonly getUserBookingsQuery: GetUserBookingsQuery,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  findMine(@CurrentUser() user: TokenPayload) {
    return this.getUserBookingsQuery.execute(user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  cancel(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    return this.cancelBookingCommand.execute({
      bookingId: id,
      userId: user.userId,
      userRole: user.role,
    });
  }
}
