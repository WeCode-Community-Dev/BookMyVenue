import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { RegisterUserCommand } from '../../../core/application/users/commands/register-user.command';
import { LoginUserCommand } from '../../../core/application/users/commands/login-user.command';
import { RefreshAccessTokenCommand } from '../../../core/application/users/commands/refresh-access-token.command';
import { LogoutCommand } from '../../../core/application/users/commands/logout.command';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { loginSchema } from '../../validation/auth/login.schema';
import { registerSchema } from '../../validation/auth/register.schema';
import { refreshTokenSchema } from '../../validation/auth/refresh-token.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { type TokenPayload } from '../../../core/application/users/services/token.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly registerUserCommand: RegisterUserCommand,
    private readonly loginUserCommand: LoginUserCommand,
    private readonly refreshAccessTokenCommand: RefreshAccessTokenCommand,
    private readonly logoutCommand: LogoutCommand,
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Validation or business rule failure' })
  register(@Body(new ZodValidationPipe(registerSchema as any)) data: RegisterDto) {
    return this.registerUserCommand.execute(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user and obtain tokens' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated' })
  @ApiResponse({ status: 400, description: 'Validation or business rule failure' })
  login(@Body(new ZodValidationPipe(loginSchema as any)) data: LoginDto) {
    return this.loginUserCommand.execute(data);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using a refresh token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired refresh token' })
  refresh(@Body(new ZodValidationPipe(refreshTokenSchema as any)) data: RefreshTokenDto) {
    return this.refreshAccessTokenCommand.execute(data);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and revoke refresh tokens' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  logout(@CurrentUser() user: TokenPayload) {
    return this.logoutCommand.execute({ userId: user.userId });
  }

}

