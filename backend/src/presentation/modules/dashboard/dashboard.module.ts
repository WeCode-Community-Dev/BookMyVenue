import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { InfraModule } from '../../../infra/infra.module';
import { DashboardController } from './dashboard.controller';
import { GetAdminDashboardQuery } from 'src/core/application/dashboard/query/admin-dashboard.query';
import { GetOwnerDashboardQuery } from 'src/core/application/dashboard/query/owner-dashboard.query';

@Module({
    imports: [InfraModule],
    controllers: [DashboardController],
    providers: [GetAdminDashboardQuery, GetOwnerDashboardQuery, JwtAuthGuard],
})
export class DashboardModule { }
