import { ApiProperty } from '@nestjs/swagger';

export class ApproveVenueDto {
  @ApiProperty()
  approve!: boolean;
}
