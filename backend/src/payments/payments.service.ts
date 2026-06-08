import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  async processPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    // Mock processing payment
    return {
      status: 'success',
      transactionId: 'txn_mock_' + Math.random().toString(36).substr(2, 9),
      bookingId: createPaymentDto.bookingId,
      amount: createPaymentDto.amount,
      processedAt: new Date(),
    };
  }
}
