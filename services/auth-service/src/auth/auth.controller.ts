import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { JwtPayload } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterDto, LoginDto, VerifyDto, LoginResponseDto, JwtPayloadDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.', type: LoginResponseDto })
  @ApiResponse({ status: 409, description: 'Conflict: user already exists or invalid data.' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.fullName,
      registerDto.roles,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized: invalid credentials.' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user JWT access token' })
  @ApiResponse({ status: 200, description: 'Token is valid.', type: JwtPayloadDto })
  @ApiResponse({ status: 401, description: 'Unauthorized: invalid token.' })
  @ApiBody({ type: VerifyDto, required: false })
  verify(
    @Body() verifyDto: VerifyDto,
    @Headers('authorization') authHeader?: string,
  ): JwtPayload {
    let jwtToken = verifyDto?.token;

    if (!jwtToken && authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        jwtToken = parts[1];
      }
    }

    if (!jwtToken) {
      throw new UnauthorizedException(
        'Token must be provided in body or Authorization header.',
      );
    }

    return this.authService.verifyToken(jwtToken);
  }
}
