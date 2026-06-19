import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth') // Groups the endpoints under "Auth" in Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  // Swagger documentation for the signup endpoint  
  @ApiOperation({ summary: 'User Sign Up' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  signup(@Body() singUpDto: SignUpDto) {
    return this.authService.signUp(singUpDto);
  }
}
