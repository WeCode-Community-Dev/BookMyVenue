import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { Roles } from './common/decorators/roles.decorator';

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
    return 'This is a secure endpoint in Auth Service!';
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get an admin-only secure message' })
  @ApiResponse({ status: 200, description: 'Access granted, admin message retrieved.', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized: missing or invalid token.' })
  @ApiResponse({ status: 403, description: 'Forbidden: insufficient role privileges.' })
  getAdminHello(): string {
    return 'Hello Admin! You have accessed the secure admin endpoint in Auth Service.';
  }
}
