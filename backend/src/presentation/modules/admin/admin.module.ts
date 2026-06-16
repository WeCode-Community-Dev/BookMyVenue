import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { InfraModule } from 'src/infra/infra.module';
import { ListVenueQuery } from 'src/core/application/admin/queries/list-venues.query';

@Module({
  imports: [InfraModule],
  controllers: [AdminController],
  providers: [ListVenueQuery]
})
export class AdminModule { }
