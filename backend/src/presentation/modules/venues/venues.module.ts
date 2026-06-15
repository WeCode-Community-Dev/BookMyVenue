import { Module } from '@nestjs/common';
import { VenuesController } from './venues.controller';
import { CreateVenueCommand } from '../../../core/application/venues/commands/create-venue.command';
import { UpdateVenueCommand } from '../../../core/application/venues/commands/update-venue.command';
import { ApproveVenueCommand } from '../../../core/application/venues/commands/approve-venue.command';
import { SearchVenuesQuery } from '../../../core/application/venues/queries/search-venues.query';
import { GetVenueDetailsQuery } from '../../../core/application/venues/queries/get-venue-details.query';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { InfraModule } from '../../../infra/infra.module';

@Module({
  imports: [InfraModule],
  controllers: [VenuesController],
  providers: [
    CreateVenueCommand,
    UpdateVenueCommand,
    ApproveVenueCommand,
    SearchVenuesQuery,
    GetVenueDetailsQuery,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class VenuesModule {}
