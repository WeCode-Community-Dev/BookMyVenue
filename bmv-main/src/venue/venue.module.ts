import { Module } from '@nestjs/common';
import { VenueService } from './venue.service';
import { VenueController } from './venue.controller';

@Module({
  controllers: [VenueController],
  providers: [VenueService],
})
export class VenueModule {}
