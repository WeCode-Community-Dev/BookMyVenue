import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenuesService } from './venues.service';
import { VenuesController } from './venues.controller';
import { Venue } from './entities/venue.entity';
import { VenueBlockedDate } from './entities/venue-blocked-date.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, VenueBlockedDate])],
  controllers: [VenuesController],
  providers: [VenuesService],
  exports: [VenuesService],
})
export class VenuesModule {}
