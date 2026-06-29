import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterUserDto {

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{6,14}$/, {
    message: 'phone must be a valid mobile number',
  })
  phone: string;

  @IsEmail({}, { message: 'email must be a valid email address' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Please verify your phone number first.' })
  phoneVerifiedToken: string;

  @IsEnum(UserRole, { message: 'role must be customer or venue_owner' })
  @IsNotEmpty()
  role: UserRole;
}
