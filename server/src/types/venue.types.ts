import { HydratedDocument, Types } from 'mongoose';

export interface IVenue {
  ownerId: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  description: string;
  images: string[];
  address: {
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  location: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };
  capacity: number;
  isAvailabilityConfigured: boolean;
  amenities: string[];
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verifiedAt: Date | null;
  rejectionReason: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isElite: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type VenueDocument = HydratedDocument<IVenue>;
