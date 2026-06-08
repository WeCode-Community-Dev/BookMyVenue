import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BookingLockDocument = BookingLock & Document;

@Schema({ timestamps: true })
export class BookingLock {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Venue', required: true })
  venueId: string;

  @Prop({ required: true })
  date: string;

  @Prop({ type: Date, default: Date.now, expires: '15m' }) // TTL index: lock expires in 15 mins automatically
  lockedAt: Date;
}

export const BookingLockSchema = SchemaFactory.createForClass(BookingLock);
