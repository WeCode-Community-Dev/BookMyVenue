import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'The plain text password of the user',
    example: 'securePassword123',
  })
  password!: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  fullName!: string;

  @ApiProperty({
    description: 'The roles assigned to the user',
    type: [String],
    required: false,
    example: ['USER'],
  })
  roles?: string[];
}

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'The plain text password of the user',
    example: 'securePassword123',
  })
  password!: string;
}

export class VerifyDto {
  @ApiProperty({
    description: 'The JWT access token to verify',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token!: string;
}

export class UserProfileDto {
  @ApiProperty({
    description: 'The unique ID of the user',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  fullName!: string;

  @ApiProperty({
    description: 'The roles assigned to the user',
    type: [String],
    example: ['USER'],
  })
  roles!: string[];
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'The access token JWT string',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;

  @ApiProperty({
    description: 'The user details object',
    type: UserProfileDto,
  })
  user!: UserProfileDto;
}

export class JwtPayloadDto {
  @ApiProperty({
    description: 'The subject/user ID',
    example: 1,
  })
  sub!: number;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  fullName!: string;

  @ApiProperty({
    description: 'The roles assigned to the user',
    type: [String],
    example: ['USER'],
  })
  roles!: string[];
}
