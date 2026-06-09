import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { VerifySignupOtpDto } from "./dto/verify-signup-otp.dto";
import { ResendOtpDto } from "./dto/resend-otp.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyForgotPasswordOtpDto } from "./dto/verify-forgot-password.dto";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Register user and send OTP to email' })
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @ApiOperation({ summary: 'Verify OTP and create account' })
    @Post('verify-otp')
    async verifyOtp(@Body() verifySignupOtpDto: VerifySignupOtpDto) {
        return this.authService.verifyOtp(verifySignupOtpDto);
    }

    @ApiOperation({ summary: 'Resend OTP to email' })
    @Post('resend-otp')
    async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
        return this.authService.resendOtp(resendOtpDto);
    }

    @ApiOperation({ summary: 'Login with email and password' })
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiOperation({ summary: "Send password reset otp to email" })
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @ApiOperation({ summary: "verify otp for password reset" })
    @Post('verify-forgot-password-otp')
    async verifyForgotPasswordOtp(@Body() verifyForgotPasswordOtpDto: VerifyForgotPasswordOtpDto) {
        return this.authService.verifyForgotPasswordOtp(verifyForgotPasswordOtpDto,);
    }

    @ApiOperation({ summary: "Reset password using otp" })
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}