import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get root hello message' })
  @ApiResponse({ status: 200, description: 'Hello message retrieved successfully.', type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a protected hello message' })
  @ApiResponse({ status: 200, description: 'Access granted, secure message retrieved.', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized: missing or invalid token.' })
  getProtectedHello(): string {
    return 'This is a secure endpoint in Venue Service!';
  }
}
