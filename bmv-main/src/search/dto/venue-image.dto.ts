import { ApiProperty } from '@nestjs/swagger';

export class VenueImageDto {
  @ApiProperty({
    example: 'https://example.com/uploads/venue1.jpg',
  })
  imageUrl!: string;
}
