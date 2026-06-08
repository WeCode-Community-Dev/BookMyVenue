import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async processPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.processPayment(createPaymentDto);
  }
}
