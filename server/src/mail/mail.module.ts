import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from './mail.service';
import { MailListener } from './mail.listener';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Venue } from '../venues/entities/venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Booking, Venue])],
  providers: [MailService, MailListener],
  exports: [MailService],
})
export class MailModule {}
