import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    mobile!: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password!: string;
}
