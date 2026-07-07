import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthRequest } from 'src/types/auth.request.interface';
import type { GoogleAuthRequest } from 'src/types/google-auth.request.interface';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('otp/request')
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto);
  }

  @Post('otp/verify')
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {

    const result = await this.authService.verifyOtp(dto);

    res.cookie('access_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return {
      message: result.message,
      user: result.user,
    };

  }

  @UseGuards(JwtAuthGuard)
  @Get('myprofile')
  getMyProfile(@Request() req: AuthRequest) {
    return this.authService.getMyProfile(req.user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Passport automatically redirects to Google.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: GoogleAuthRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.googleLogin(req.user);

  res.cookie('access_token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });


  return {
    message: result.message,
    user: result.user,
  };
  }
}
