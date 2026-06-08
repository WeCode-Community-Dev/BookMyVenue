import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingLock, BookingLockDocument } from './schemas/booking-lock.schema';

@Injectable()
export class BookingLocksService {
  constructor(
    @InjectModel(BookingLock.name) private readonly lockModel: Model<BookingLockDocument>,
  ) {}

  async acquireLock(venueId: string, date: string): Promise<boolean> {
    const existingLock = await this.lockModel.findOne({ venueId, date }).exec();
    if (existingLock) {
      return false; // Already locked
    }
    
    try {
      const lock = new this.lockModel({ venueId, date });
      await lock.save();
      return true; // Lock acquired
    } catch {
      return false; // Failed to acquire (e.g. concurrent race conditions)
    }
  }

  async releaseLock(venueId: string, date: string): Promise<boolean> {
    const result = await this.lockModel.deleteOne({ venueId, date }).exec();
    return result.deletedCount > 0;
  }

  async isLocked(venueId: string, date: string): Promise<boolean> {
    const lock = await this.lockModel.findOne({ venueId, date }).exec();
    return !!lock;
  }
}
