import { ApiProperty } from '@nestjs/swagger';
import { VenuePreviewDto } from './venue-preview.dto';

export class SearchNavbarResponseDto {
  @ApiProperty({
    type: [VenuePreviewDto],
    example: [
      {
        id: '4bb7c6f8-23bd-4e59-b264-123456789abc',
        name: 'Grand Palace Hall',
        city: 'Kochi',
        address: '123 Beach Road, Kochi',
        price: 12000,
        capacity: 250,
        images: [{ imageUrl: 'https://example.com/uploads/venue1.jpg' }],
      },
      {
        id: '5c92f6b7-98fa-4161-91b9-234567890def',
        name: 'Silverline Banquet',
        city: 'Chennai',
        address: '45 Anna Salai, Chennai',
        price: 8500,
        capacity: 180,
        images: [{ imageUrl: 'https://example.com/uploads/venue2.jpg' }],
      },
    ],
  })
  results!: VenuePreviewDto[];
}
