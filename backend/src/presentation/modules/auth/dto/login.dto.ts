import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

  @ApiProperty({ example: 'user@bmv.com' })
  email!: string;

  @ApiProperty({ example: 'password123' })
  password!: string;

}
