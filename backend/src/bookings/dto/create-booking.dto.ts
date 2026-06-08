export class CreateBookingDto {
  readonly userId: string;
  readonly venueId: string;
  readonly date: string;
  readonly hours: number;
  readonly totalPrice: number;
}
