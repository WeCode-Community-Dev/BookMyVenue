import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateSlotPricingDto {
  @IsInt()
  @Min(1)
  minGuests!: number;

  @IsInt()
  @Min(1)
  maxGuests!: number;

  @IsNumber()
  @Min(0)
  price!: number;
}
