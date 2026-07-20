import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type VenueDocument = Venue & Document;

@Schema({ _id: true })
export class PredefinedSlot {
  @Prop({ required: false })
  name?: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true, default: 0 })
  price: number;
}

export const PredefinedSlotSchema = SchemaFactory.createForClass(PredefinedSlot);

@Schema({ _id: false })
export class DayAvailability {
  @Prop({ required: false, default: false })
  isOpen: boolean;

  @Prop({ type: [PredefinedSlotSchema], default: [] })
  slots: PredefinedSlot[];
}

export const DayAvailabilitySchema = SchemaFactory.createForClass(DayAvailability);

@Schema({ _id: false })
export class WeeklyAvailability {
  @Prop({ type: DayAvailabilitySchema, default: () => ({ isOpen: true, slots: [] }) })
  monday: DayAvailability;

  @Prop({ type: DayAvailabilitySchema, default: () => ({ isOpen: true, slots: [] }) })
  tuesday: DayAvailability;

  @Prop({ type: DayAvailabilitySchema, default: () => ({ isOpen: true, slots: [] }) })
  wednesday: DayAvailability;

  @Prop({ type: DayAvailabilitySchema, default: () => ({ isOpen: true, slots: [] }) })
  thursday: DayAvailability;

  @Prop({ type: DayAvailabilitySchema, default: () => ({ isOpen: true, slots: [] }) })
  friday: DayAvailability;

  @Prop({ type: DayAvailabilitySchema, default: () => ({ isOpen: true, slots: [] }) })
  saturday: DayAvailability;

  @Prop({ type: DayAvailabilitySchema, default: () => ({ isOpen: true, slots: [] }) })
  sunday: DayAvailability;
}

export const WeeklyAvailabilitySchema = SchemaFactory.createForClass(WeeklyAvailability);

@Schema({ _id: false })
export class BookingModes {
  @Prop({ default: true })
  fixedSlots: boolean;

  @Prop({ default: false })
  hourlyBooking: boolean;

  @Prop({ default: false })
  customRequests: boolean;
}

export const BookingModesSchema = SchemaFactory.createForClass(BookingModes);

@Schema({ _id: false })
export class HourlyBookingConfiguration {
  @Prop({ default: false })
  enabled: boolean;

  @Prop({ required: false })
  startTime?: string;

  @Prop({ required: false })
  endTime?: string;

  @Prop({ required: false })
  pricePerHour?: number;

  @Prop({ default: 1 })
  minimumHours: number;

  @Prop({ default: 12 })
  maximumHours: number;
}

export const HourlyBookingConfigurationSchema = SchemaFactory.createForClass(HourlyBookingConfiguration);

@Schema({ _id: false })
export class CustomBookingConfiguration {
  @Prop({ default: false })
  enabled: boolean;

  @Prop({ default: true })
  ownerApprovalRequired: boolean;

  @Prop({ default: 24 })
  minimumNoticeHours: number;
}

export const CustomBookingConfigurationSchema = SchemaFactory.createForClass(CustomBookingConfiguration);

@Schema({ 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Venue {
  
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  ownerId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  type: string;

  @Prop({ required: false })
  capacity: number;

  @Prop({ required: false })
  location: string;

  @Prop({ required: false })
  rating: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: false })
  description: string;

  @Prop([String])
  amenities: string[];

  @Prop({ default: false })
  featured: boolean;

  @Prop({ type: BookingModesSchema, default: () => ({}) })
  bookingModes: BookingModes;

  @Prop({ type: HourlyBookingConfigurationSchema, default: () => ({}) })
  hourlyBookingConfiguration: HourlyBookingConfiguration;

  @Prop({ type: CustomBookingConfigurationSchema, default: () => ({}) })
  customBookingConfiguration: CustomBookingConfiguration;

  @Prop({ type: WeeklyAvailabilitySchema, required: false })
  availability?: WeeklyAvailability;
}

export const VenueSchema = SchemaFactory.createForClass(Venue);

// Map _id to id virtual property automatically for the JSON output
VenueSchema.virtual('id').get(function (this: VenueDocument) {
  return this._id.toHexString();
});

VenueSchema.virtual('imageUrl').get(function (this: VenueDocument) {
  if (this.images && this.images.length > 0) {
    const firstImg = this.images[0];
    if (firstImg.startsWith('/uploads/')) {
      return `http://localhost:3001${firstImg}`;
    }
    return firstImg;
  }
  return '';
});
