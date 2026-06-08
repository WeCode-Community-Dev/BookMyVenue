import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Venue', required: true })
  venueId: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  hours: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: 'pending' }) // pending, confirmed, cancelled, completed
  status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
