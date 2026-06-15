import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false, enum: ['USER', 'VENUE_OWNER', 'ADMIN'] })
  role?: 'USER' | 'VENUE_OWNER' | 'ADMIN';
}
