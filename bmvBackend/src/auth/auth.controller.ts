import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
@Controller('auth')
@UseGuards(ThrottlerGuard)  // All auth routes are rate-limited
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * POST /auth/send-otp
   * Step 1: Request an OTP for the given phone number.
   * Rate-limit: 3 req / min — prevents SMS cost abuse & OTP brute-force.
   */
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ otp: { limit: 3, ttl: 60_000 } })
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  /**
   * POST /auth/verify-otp
   * Step 2: Verify the OTP. Returns a short-lived phoneVerifiedToken on success.
   * Rate-limit: 3 req / min — same strict pool to prevent brute-force.
   */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ otp: { limit: 3, ttl: 60_000 } })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  /**
   * POST /auth/login
   * Sign in with email + password.
   * Returns: { accessToken (15 min), refreshToken (7 days), expiresIn, user }
   * Rate-limit: 10 req / min — protects against credential stuffing.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)

  @Throttle({ login: { limit: 10, ttl: 60_000 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  /**
   * POST /auth/refresh
   * Rotate tokens. Send the current refreshToken to get a new token pair.
   * The old refresh token is invalidated immediately (rotation).
   * Rate-limit: 10 req / min.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ login: { limit: 10, ttl: 60_000 } })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  /**
   * POST /auth/logout
   * Invalidate the current session by deleting the refresh token from DB.
   * The access token will expire naturally within 15 minutes.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto);
  }
}
