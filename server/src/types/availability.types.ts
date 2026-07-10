import { Document, Types } from 'mongoose';

export interface IAvailability extends Document {
  venueId: Types.ObjectId;
  openingTime: string;
  closingTime: string;
  availableDays: number[];
  minBookingDuration: number;
  maxBookingDuration: number | null;
  pricePerHour: number;
  bufferTime: number;
  createdAt: Date;
  updatedAt: Date;
}
