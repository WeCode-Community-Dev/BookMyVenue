import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetUserProfileQuery } from '../../../core/application/users/queries/get-user-profile.query';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { type TokenPayload } from '../../../core/application/users/services/token.interface';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/presentation/guards/roles.guard';
import { Roles } from 'src/presentation/decorators/roles.decorator';
import { UserRole } from 'src/core/domain/_shared/enum/UserRole';
import { ListUsersQuery } from 'src/core/application/users/queries/list-users.query';

@ApiTags('users')
@Controller({
  version: '1',
  path: 'users',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(
    private readonly getUserProfileQuery: GetUserProfileQuery,
    private readonly listUsersQuery: ListUsersQuery,
  ) { }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  listUsers(@CurrentUser() user: TokenPayload) {
    return this.listUsersQuery.execute();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@CurrentUser() user: TokenPayload) {
    return this.getUserProfileQuery.execute(user.userId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user profile by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Profile found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.getUserProfileQuery.execute(id);
  }

}
