import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { VerifySignupOtpDto } from "./dto/verify-signup-otp.dto";
import { ResendOtpDto } from "./dto/resend-otp.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyForgotPasswordOtpDto } from "./dto/verify-forgot-password.dto";
import { Public } from "../../shared/decorators/public.decorator";
import { AuthenticatedRequest } from "./types/authenticated-request.type";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Register user and send OTP to email' })
    @Public()
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @ApiOperation({ summary: 'Verify OTP and create account' })
    @Public()
    @Post('verify-otp')
    async verifyOtp(@Body() verifySignupOtpDto: VerifySignupOtpDto) {
        return this.authService.verifyOtp(verifySignupOtpDto);
    }

    @ApiOperation({ summary: 'Resend OTP to email' })
    @Public()
    @Post('resend-otp')
    async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
        return this.authService.resendOtp(resendOtpDto);
    }

    @ApiOperation({ summary: 'Login with email and password' })
    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiOperation({ summary: "Send password reset otp to email" })
    @Public()
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @ApiOperation({ summary: "verify otp for password reset" })
    @Public()
    @Post('verify-forgot-password-otp')
    async verifyForgotPasswordOtp(@Body() verifyForgotPasswordOtpDto: VerifyForgotPasswordOtpDto) {
        return this.authService.verifyForgotPasswordOtp(verifyForgotPasswordOtpDto);
    }

    @ApiOperation({ summary: "Reset password using otp" })
    @Public()
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "get current user details" })
    @Get('me')
    async me(@Req() req: AuthenticatedRequest) {
        return this.authService.me(req.user.sub);
    }

    @ApiOperation({ summary: "logout user" })
    @Post('logout')
    async logout() {
        return this.authService.logout();
    }
}