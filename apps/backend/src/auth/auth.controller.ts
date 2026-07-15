import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
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
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('otp/request')
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto);
  }

  @Post('otp/verify')
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyOtp(dto);

    this.authService.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
    );

    return {
      message: result.message,
      user: result.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('myprofile')
  getMyProfile(@Req() req: AuthRequest) {
    return this.authService.getMyProfile(req.user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Passport automatically redirects to Google.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: GoogleAuthRequest, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);

    this.authService.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
    );

    return res.redirect(`${process.env.FRONTEND_URL}/venues`);
  }

  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const accessToken = await this.authService.refresh(
      req.cookies.refresh_token,
    );

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return {
      message: 'Access token refreshed',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return {
      message: 'Logged out successfully',
    };
  }
}
