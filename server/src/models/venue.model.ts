import mongoose, { Document, Schema } from "mongoose";
import { VenueTypeEnum, VenueTypeEnumType } from "../enums/venue-enum";

export interface VenueDocument extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  venueType: VenueTypeEnumType;
  address?: string;
  city?: string;
  capacity?: number;
  pricePerHour: number;
  openingTime: number; // minutes from midnight, e.g. 540 = 09:00
  closingTime: number; // minutes from midnight, e.g. 1380 = 23:00
  images: string[];
  amenities: string[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const venueSchema = new Schema<VenueDocument>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    venueType: {
      type: String,
      enum: Object.values(VenueTypeEnum),
      required: true,
    },
    address: String,
    city: String,
    capacity: Number,
    pricePerHour: {
      type: Number,
      required: true,
    },
    openingTime: {
      type: Number,
      required: true,
      min: 0,
      max: 1440,
    },
    closingTime: {
      type: Number,
      required: true,
      min: 0,
      max: 1440,
    },
    images: [String],
    amenities: [String],
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const VenueModel = mongoose.model<VenueDocument>("Venue", venueSchema);
export default VenueModel;
