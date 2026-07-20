import { IsNumber, IsOptional, IsString, IsObject } from "class-validator";

export class RescheduleRequestDto {
  @IsString()
  readonly requestedDate: string;

  @IsNumber()
  readonly requestedHours: number;

  @IsObject()
  @IsOptional()
  readonly requestedSlot?: {
    startTime: string;
    endTime: string;
    price: number;
  };

  @IsString()
  @IsOptional()
  readonly reason?: string;
}
