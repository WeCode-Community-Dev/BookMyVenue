import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { type TokenPayload } from '../../../core/application/users/services/token.interface';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/presentation/guards/roles.guard';
import { Roles } from 'src/presentation/decorators/roles.decorator';
import { UserRole } from 'src/core/domain/_shared/enum/UserRole';
import { GetAdminDashboardQuery } from 'src/core/application/dashboard/query/admin-dashboard.query';
import { GetOwnerDashboardQuery } from 'src/core/application/dashboard/query/owner-dashboard.query';

@ApiTags('dashboard')
@Controller({
    version: '1',
    path: 'dashboard',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class DashboardController {
    constructor(
        private readonly getAdminDashboardQuery: GetAdminDashboardQuery,
        private readonly getOwnerDashboardQuery: GetOwnerDashboardQuery,
    ) { }

    @Get('admin')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get admin dashboard (for admin)' })
    @ApiResponse({ status: 200, description: 'List of users' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    adminDashboard(@CurrentUser() user: TokenPayload) {
        return this.getAdminDashboardQuery.execute();
    }

    @Get('owner')
    @Roles(UserRole.VENUE_OWNER)
    @ApiOperation({ summary: 'Get owner dashboard (for owner)' })
    @ApiResponse({ status: 200, description: 'List of users' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    ownerDashboard(@CurrentUser() user: TokenPayload) {
        return this.getOwnerDashboardQuery.execute(user.userId);
    }

}
