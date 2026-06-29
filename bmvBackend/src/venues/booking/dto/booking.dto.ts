import { IsUUID, IsString, IsNotEmpty, IsOptional, Matches, MaxLength, IsIn } from 'class-validator';

export class CreateBookingDto {
  @IsUUID('4', { message: 'venueId must be a valid UUID' })
  @IsNotEmpty({ message: 'venueId is required' })
  venueId: string;

  @IsString({ message: 'bookingDate must be a string' })
  @IsNotEmpty({ message: 'bookingDate is required' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'bookingDate must be in YYYY-MM-DD format (e.g. 2026-06-20)',
  })
  bookingDate: string;

  @IsOptional()
  @IsString({ message: 'specialRequest must be a string' })
  @MaxLength(1000, { message: 'specialRequest cannot exceed 1000 characters' })
  specialRequest?: string;
}

export class CancelBookingDto {
  @IsString({ message: 'cancellationReason must be a string' })
  @IsNotEmpty({ message: 'cancellationReason is required' })
  @MaxLength(500, { message: 'cancellationReason cannot exceed 500 characters' })
  cancellationReason: string;
}

export class VerifyPaymentDto {
  @IsString({ message: 'orderId must be a string' })
  @IsNotEmpty({ message: 'orderId is required' })
  orderId: string;

  @IsString({ message: 'paymentId must be a string' })
  @IsNotEmpty({ message: 'paymentId is required' })
  paymentId: string;

  @IsString({ message: 'signature must be a string' })
  @IsNotEmpty({ message: 'signature is required' })
  signature: string;
}

export class CancelPaymentDto {
  @IsString({ message: 'orderId must be a string' })
  @IsNotEmpty({ message: 'orderId is required' })
  orderId: string;
}

export class MockPayDto {
  @IsString({ message: 'orderId must be a string' })
  @IsNotEmpty({ message: 'orderId is required' })
  orderId: string;

  @IsString({ message: 'status must be a string' })
  @IsNotEmpty({ message: 'status is required' })
  @IsIn(['SUCCESS', 'FAIL'], { message: 'status must be either SUCCESS or FAIL' })
  status: 'SUCCESS' | 'FAIL';
}