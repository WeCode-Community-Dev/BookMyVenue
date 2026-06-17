import { Module } from '@nestjs/common';
import { VenuesController } from './venues.controller';
import { CreateVenueCommand } from '../../../core/application/venues/commands/create-venue.command';
import { SearchVenuesQuery } from '../../../core/application/venues/queries/search-venues.query';
import { GetVenueDetailsQuery } from '../../../core/application/venues/queries/get-venue-details.query';
import { FindMyVenuesQuery } from '../../../core/application/venues/queries/find-my-venues.query';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { InfraModule } from '../../../infra/infra.module';

@Module({
  imports: [InfraModule],
  controllers: [VenuesController],
  providers: [
    FindMyVenuesQuery,
    CreateVenueCommand,
    SearchVenuesQuery,
    GetVenueDetailsQuery,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class VenuesModule { }
