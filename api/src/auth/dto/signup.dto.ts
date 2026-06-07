import {
    IsEmail,
    IsString,
    MinLength
} from 'class-validator';

export class SignupDto {

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsString()
    username: string;

}