import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VenuesController } from './venues.controller';
import { PublicVenuesController } from './public-venues.controller';
import { VenuesService } from './venues.service';
import { Venue } from './entities/venue.entity';
import { VenueImage } from './entities/venue-image.entity';
import { VenueDocument } from './entities/venue-document.entity';
import { VenueVerificationRequest } from './entities/venue-verification-request.entity';
import { AdminVenueModule } from './admin-venue/admin-venue.module';
import { VenueBlockedDate } from './entities/venue-blocked-date.entity';
import { Booking } from './booking/entities/booking.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Venue,
      VenueImage,
      VenueDocument,
      VenueVerificationRequest,
      VenueBlockedDate,
      Booking,
    ]),
    AdminVenueModule,
  ],
  controllers: [VenuesController, PublicVenuesController],
  providers: [VenuesService],
})
export class VenuesModule { }

