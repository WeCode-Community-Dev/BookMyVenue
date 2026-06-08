import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { VerifySignupOtpDto } from "./dto/verify-signup-otp.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() verifySignupOtpDto: VerifySignupOtpDto) {
        return this.authService.verifyOtp(verifySignupOtpDto);
    }
}