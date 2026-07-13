import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { IdempotencyService } from './idempotency/idempotency.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/providers/prisma/prisma.module';
import { RazorpayModule } from 'src/providers/razorpay/razorpay-module';
import { SlotLockService } from './slot-lock/slot-lock.service';

@Module({
  imports: [PrismaModule, RazorpayModule],
  controllers: [BookingController],
  providers: [BookingService, IdempotencyService, SlotLockService],
})
export class BookingModule {}
