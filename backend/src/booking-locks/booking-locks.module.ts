import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingLocksService } from './booking-locks.service';
import { BookingLock, BookingLockSchema } from './schemas/booking-lock.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BookingLock.name, schema: BookingLockSchema }]),
  ],
  providers: [BookingLocksService],
  exports: [BookingLocksService],
})
export class BookingLocksModule {}
