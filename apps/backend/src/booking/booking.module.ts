import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { IdempotencyService } from './idempotency/idempotency.service';
import { Module } from '@nestjs/common';
import { SlotLockService } from './slot-lock/slot-lock.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, IdempotencyService, SlotLockService],
})
export class BookingModule {}
