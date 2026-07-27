import { Document, Types } from 'mongoose';

export interface BlackoutDate {
  startDate: Date;
  endDate: Date;
  reason?: string;
}

export interface IAvailability extends Document {
  venueId: Types.ObjectId;
  openingTime: string;
  closingTime: string;
  availableDays: number[];
  minBookingDuration: number;
  maxBookingDuration: number | null;
  pricePerHour: number;
  bufferTime: number;
  blackoutDates?: BlackoutDate[];
  createdAt: Date;
  updatedAt: Date;
}
