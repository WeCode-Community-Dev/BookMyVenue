import { Controller, Post, Body, Get, UseGuards, Req ,Patch } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgetPassDto } from './dto/forget-pass.dto';
import { ResetPasswordDto } from './dto/pass-reset.dto';
import { GoogleAuthGuard } from 'src/guard/google.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VerifyForgotPasswordOtpDto } from './dto/otp.dto';

@ApiTags('auth') // Groups the endpoints under "Auth" in Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  // Swagger documentation for the signup endpoint
  @ApiOperation({ summary: 'User Sign Up' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  // Swagger documentation for the login endpoint
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current authenticated user for testing purposes',
  })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user returned successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    console.log('Controller reached');
    return req.user;
  }

  @Get('google')
  // Swagger documentation for the Google OAuth login endpoint
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 200, description: 'Google OAuth login initiated.' })
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/callback')
  // Swagger documentation for the Google OAuth callback endpoint
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google OAuth login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(GoogleAuthGuard)
  googleCallback(@Req() req) {
    return this.authService.googleLogin(req.user);
  }
  @Post('forgot-password')
  // Swagger documentation for the forgot password endpoint
  @ApiOperation({ summary: 'Initiate forgot password process' })
  @ApiResponse({ status: 200, description: 'Forgot password email sent.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  forgotPassword(@Body() forgetPassDto: ForgetPassDto) {
    return this.authService.forgotPassword(forgetPassDto.email);
  }

  @Post('verify-forgot-password-otp')
  @ApiOperation({ summary: 'Verify forgot password OTP' })
  verifyForgotPasswordOtp(@Body() verifyDto: VerifyForgotPasswordOtpDto) {
    return this.authService.verifyForgotPasswordOtp(verifyDto);
  }
@Patch('reset-password')
@ApiOperation({ summary: 'Reset user password' })
resetPassword(
  @Body() resetPasswordDto: ResetPasswordDto,
) {
  return this.authService.resetPassword(
    resetPasswordDto,
  );
}


}
