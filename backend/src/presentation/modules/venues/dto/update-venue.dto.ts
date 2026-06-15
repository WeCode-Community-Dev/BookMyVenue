import { ApiProperty } from '@nestjs/swagger';

export class UpdateVenueDto {
  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  venueType!: string;

  @ApiProperty()
  addressLine1!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  state!: string;

  @ApiProperty()
  country!: string;

  @ApiProperty()
  postalCode!: string;

  @ApiProperty({ required: false, nullable: true })
  latitude?: number | null;

  @ApiProperty({ required: false, nullable: true })
  longitude?: number | null;

  @ApiProperty()
  capacity!: number;

  @ApiProperty()
  pricePerDay!: number;
}
