import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPaymentDto {
    @ApiProperty({ example: 'pay_xxxxx', description: 'Razorpay payment id' })
    @IsString()
    @IsNotEmpty()
    razorpay_payment_id!: string;

    @ApiProperty({ example: 'order_xxxxx', description: 'Razorpay order id' })
    @IsString()
    @IsNotEmpty()
    razorpay_order_id!: string;

    @ApiProperty({ example: 'abcdef123456', description: 'Razorpay checkout signature' })
    @IsString()
    @IsNotEmpty()
    razorpay_signature!: string;
}