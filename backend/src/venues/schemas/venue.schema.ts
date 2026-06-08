import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type VenueDocument = Venue & Document;

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
  pricePerHour: number;

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
