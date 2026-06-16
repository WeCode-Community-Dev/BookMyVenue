import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { InfraModule } from 'src/infra/infra.module';
import { ListVenueQuery } from 'src/core/application/admin/queries/list-venues.query';
import { ApproveVenueCommand } from 'src/core/application/admin/commands/approve-venue.command';
import { RejectVenueCommand } from 'src/core/application/admin/commands/reject-venue.command';

@Module({
  imports: [InfraModule],
  controllers: [AdminController],
  providers: [ListVenueQuery, ApproveVenueCommand, RejectVenueCommand]
})
export class AdminModule { }
