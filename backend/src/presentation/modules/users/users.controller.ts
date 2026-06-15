import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetUserProfileQuery } from '../../../core/application/users/queries/get-user-profile.query';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { type TokenPayload } from '../../../core/application/users/services/token.interface';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly getUserProfileQuery: GetUserProfileQuery) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@CurrentUser() user: TokenPayload) {
    return this.getUserProfileQuery.execute(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.getUserProfileQuery.execute(id);
  }
}
