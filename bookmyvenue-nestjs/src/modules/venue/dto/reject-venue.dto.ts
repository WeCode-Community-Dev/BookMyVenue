import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RejectVenueDto {
  @ApiProperty({
    example: 'Venue details are incomplete. Please update the address and pricing details.',
    description: 'Reason shown to the owner when admin rejects the venue',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  reason!: string;
}