import {
  Body,
  Controller,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthRequest } from 'src/types/auth.request.interface';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createBooking(
    @Body() dto: CreateBookingDto,
    @Headers('idempotency-key') idempotencyKey: string,
    @Request() req: AuthRequest,
  ) {
    return this.bookingService.createBooking(dto, req.user.id, idempotencyKey);
  }

  @Post('verify-payment')
  @UseGuards(JwtAuthGuard)
  verifyPayment(@Body() dto: VerifyPaymentDto, @Request() req: AuthRequest) {
    return this.bookingService.verifyPayment(dto, req.user.id);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  cancelBooking(@Body() dto: CancelBookingDto, @Request() req: AuthRequest) {
    return this.bookingService.cancelBooking(dto, req.user.id);
  }
}
