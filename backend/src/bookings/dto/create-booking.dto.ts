import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBookingDto {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly venueId: string;

  @IsString()
  readonly date: string;

  @IsNumber()
  readonly hours: number;

  @IsNumber()
  readonly totalPrice: number;

  @IsString()
  @IsOptional()
  readonly status?: string;
}
