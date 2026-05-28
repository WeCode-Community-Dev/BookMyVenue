import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingLock, LockStatus } from './entities/booking-lock.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { Venue } from '../venues/entities/venue.entity';

@Injectable()
export class BookingLocksService {
  constructor(
    @InjectRepository(BookingLock)
    private locksRepository: Repository<BookingLock>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
  ) {}

  async lockSlot(
    venueId: string,
    bookingDate: string,
    startTime: string,
    endTime: string,
    userId: string,
  ) {
    // Verify venue exists
    const venue = await this.venuesRepository.findOne({ where: { id: venueId } });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    // Check for existing active locks on this slot
    const existingLock = await this.locksRepository.findOne({
      where: {
        venueId,
        bookingDate,
        status: LockStatus.ACTIVE,
      },
    });

    if (existingLock) {
      // Check if the lock overlaps
      if (this.timesOverlap(existingLock.startTime, existingLock.endTime, startTime, endTime)) {
        if (new Date() < new Date(existingLock.expiresAt)) {
          throw new ConflictException('This slot is temporarily locked by another user');
        }
        // Lock expired, mark it
        existingLock.status = LockStatus.EXPIRED;
        await this.locksRepository.save(existingLock);
      }
    }

    // Check for existing confirmed bookings
    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        venueId,
        bookingDate,
        bookingStatus: BookingStatus.CONFIRMED,
      },
    });

    if (existingBooking) {
      if (this.timesOverlap(existingBooking.startTime, existingBooking.endTime, startTime, endTime)) {
        throw new ConflictException('This slot is already booked');
      }
    }

    // Create the lock (5 minute TTL)
    const lockDurationMinutes = parseInt(process.env.BOOKING_LOCK_DURATION_MINUTES || '5', 10);
    const expiresAt = new Date(Date.now() + lockDurationMinutes * 60 * 1000);

    const lock = this.locksRepository.create({
      venueId,
      bookingDate,
      startTime,
      endTime,
      lockedByUserId: userId,
      expiresAt,
      status: LockStatus.ACTIVE,
    });

    return this.locksRepository.save(lock);
  }

  async releaseLock(lockId: string, userId: string) {
    const lock = await this.locksRepository.findOne({
      where: { id: lockId },
    });

    if (!lock) {
      throw new NotFoundException('Lock not found');
    }

    if (lock.lockedByUserId !== userId) {
      throw new ForbiddenException('You can only release your own locks');
    }

    lock.status = LockStatus.RELEASED;
    return this.locksRepository.save(lock);
  }

  async getUserActiveLock(userId: string) {
    return this.locksRepository.findOne({
      where: {
        lockedByUserId: userId,
        status: LockStatus.ACTIVE,
      },
      relations: { venue: true },
    });
  }

  // CRON job: expire stale locks every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async expireStaleLocksJob() {
    await this.locksRepository.update(
      {
        status: LockStatus.ACTIVE,
        expiresAt: LessThan(new Date()),
      },
      { status: LockStatus.EXPIRED },
    );
  }

  private timesOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ): boolean {
    return start1 < end2 && end1 > start2;
  }
}
