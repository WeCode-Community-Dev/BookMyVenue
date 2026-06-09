import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user resetting their password',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'StrongPass123',
    description:
      'New password. Must be 8-72 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  newPassword!: string;

  @ApiProperty({
    example: 'StrongPass123',
    description: 'Password confirmation. Must match the new password',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword!: string;
}
