import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class VerifyPaymentDto {
  @ApiProperty({example: 'c9b9f9f0-8d3c-4c12-a2b6-6a0f5b123456'})
  @IsUUID()
  bookingId!: string;

  @ApiProperty({example: 'order_1234567890'})
  @IsString()
  @IsNotEmpty()
  razorpayOrderId!: string;

  @ApiProperty({example: 'pay_1234567890'})
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId!: string;

  @ApiProperty({example: 'sig_1234567890'})
  @IsString()
  @IsNotEmpty()
  razorpaySignature!: string;
}