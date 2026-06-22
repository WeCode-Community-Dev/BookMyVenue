import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService, LoginResponse, SignupResponse } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Post('signup')
    signup(@Body() dto: SignupDto): Promise<SignupResponse> {
        return this.authService.signup(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto): Promise<LoginResponse> {
        return this.authService.login(dto);
    }
}
