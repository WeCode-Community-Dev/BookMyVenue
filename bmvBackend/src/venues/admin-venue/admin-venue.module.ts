import { Module } from '@nestjs/common';
import { AdminVenueController } from './admin-venue.controller';
import { AdminVenueService } from './admin-venue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Venue } from '../entities/venue.entity';
import { VenueVerificationRequest } from '../entities/venue-verification-request.entity';
import { VenueNotificationsService } from './venue-notify.service';
import { User } from 'src/users/entities/user.entity';
import { CustomerProfile } from 'src/users/entities/customer-profile.entity';

@Module({
  imports: [
    ConfigModule, TypeOrmModule.forFeature([
      Venue,
      VenueVerificationRequest,
      User,
      CustomerProfile,
    ]),
  ],
  controllers: [AdminVenueController],
  providers: [AdminVenueService, VenueNotificationsService],
  exports: [VenueNotificationsService]
})
export class AdminVenueModule { }
