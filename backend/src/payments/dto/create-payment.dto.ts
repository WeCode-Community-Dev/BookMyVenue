export class CreatePaymentDto {
  readonly bookingId: string;
  readonly amount: number;
  readonly paymentMethod: string;
}
