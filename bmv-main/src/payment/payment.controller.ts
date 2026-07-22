import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { VerifyPaymentDto } from './dto/verify-order.dto';
import { PaymentService } from './payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../guard/jwt.guard';

@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Post('create-order')
  @ApiOperation({
    summary: 'Create Razorpay order',
  })
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req,
  ) {
    return this.paymentService.createOrder(
      createOrderDto,
      req.user.userId,
    );
  }
  @Post('verify')
@ApiOperation({
  summary: 'Verify Razorpay payment',
})
verifyPayment(
  @Body() verifyPaymentDto: VerifyPaymentDto,
  @Req() req,
) {
  return this.paymentService.verifyPayment(
    verifyPaymentDto,
    req.user.userId,
  );
}
}
