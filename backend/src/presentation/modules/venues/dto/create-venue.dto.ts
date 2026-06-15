import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVenueDto {
  @ApiProperty({ example: 'Grand Ballroom' })
  title!: string;

  @ApiProperty({ example: 'A beautiful ballroom for your special event' })
  description!: string;

  @ApiProperty({ example: 'Conference Hall' })
  venueType!: string;

  @ApiProperty({ example: '123 Main Street' })
  addressLine1!: string;

  @ApiProperty({ example: 'Calicut' })
  city!: string;

  @ApiProperty({ example: 'KOK' })
  state!: string;

  @ApiProperty({ example: 'IND' })
  country!: string;

  @ApiProperty({ example: '676305' })
  postalCode!: string;

  @ApiPropertyOptional({ example: 11.258753 })
  latitude?: number;

  @ApiPropertyOptional({ example: 75.780411 })
  longitude?: number;

  @ApiProperty({ example: 100 })
  capacity!: number;

  @ApiProperty({ example: 500 })
  pricePerDay!: number;
}
