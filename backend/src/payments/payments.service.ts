import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly bookingsService: BookingsService) {}

  async processPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    // Process and confirm the booking lock on backend
    const booking = await this.bookingsService.confirmPayment(createPaymentDto.bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${createPaymentDto.bookingId} not found`);
    }

    // Mock processing payment
    return {
      status: 'success',
      transactionId: 'txn_mock_' + Math.random().toString(36).substring(2, 11),
      bookingId: createPaymentDto.bookingId,
      amount: createPaymentDto.amount,
      processedAt: new Date(),
    };
  }
}
