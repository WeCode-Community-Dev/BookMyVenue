import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'fathima@example.com',
    description: 'Registered email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Password associated with the account',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}