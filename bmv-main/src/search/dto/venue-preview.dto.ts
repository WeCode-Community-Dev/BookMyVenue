import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VenueImageDto } from './venue-image.dto';

export class VenuePreviewDto {
  @ApiProperty({ example: '4bb7c6f8-23bd-4e59-b264-123456789abc' })
  id!: string;

  @ApiProperty({ example: 'Grand Palace Hall' })
  name!: string;

  @ApiProperty({ example: 'Kochi' })
  city!: string;

  @ApiPropertyOptional({ example: '123 Beach Road, Kochi' })
  address?: string;

  @ApiProperty({ example: 12000 })
  price!: number;

  @ApiProperty({ example: 250 })
  capacity!: number;

  @ApiProperty({
    type: [VenueImageDto],
    example: [{ imageUrl: 'https://example.com/uploads/venue1.jpg' }],
  })
  images!: VenueImageDto[];
}
