import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  readonly bookingId: string;

  @IsNumber()
  readonly amount: number;

  @IsString()
  @IsNotEmpty()
  readonly paymentMethod: string;
}
