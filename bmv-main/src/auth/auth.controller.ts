import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgetPassDto } from './dto/forget-pass.dto';
import { ResetPasswordDto } from './dto/pass-reset.dto';
import { GoogleAuthGuard } from 'src/guard/google.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VerifyForgotPasswordOtpDto } from './dto/otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User Sign Up' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user returned successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    return req.user;
  }

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 200, description: 'Google OAuth login initiated.' })
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/callback')
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google OAuth login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(GoogleAuthGuard)
  googleCallback(@Req() req) {
    return this.authService.googleLogin(req.user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Initiate forgot password process' })
  @ApiResponse({ status: 200, description: 'Forgot password email sent.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  forgotPassword(@Body() forgetPassDto: ForgetPassDto) {
    return this.authService.forgotPassword(forgetPassDto.email);
  }

  @Post('verify-forgot-password-otp')
  @ApiOperation({ summary: 'Verify forgot password OTP' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or request.' })
  verifyForgotPasswordOtp(@Body() verifyDto: VerifyForgotPasswordOtpDto) {
    return this.authService.verifyForgotPasswordOtp(verifyDto);
  }

  @Patch('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid password reset request.' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
