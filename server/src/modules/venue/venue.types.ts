import type mongoose from 'mongoose';
import type { Document } from 'mongoose';
import type {
  VenueStatusEnum,
  VenueFields,
  ReviewIntentType,
} from '../../constants/venue.constants';

export type VenueStatus = (typeof VenueStatusEnum)[number];

export type PlainVenue = Omit<IVenue, keyof Document> & { _id: IVenue['_id'] };

export type VenueKey = (typeof VenueFields)[number];

export interface IGeoPoint {
  type: 'Point';
  /** [longitude, latitude] — GeoJSON order */
  coordinates: [number, number];
}

export interface IFixedPackage {
  slotName: string;
  startTime: string; // 09:00
  endTime: string; // 13:00
  price: number;
}

export interface IPricingRule {
  fromTime: string;
  toTime: string;
  price: number;
}

export interface IPricing {
  pricingType: 'fixedPricing' | 'timeBasedPricing';
  basePrice: number;
  pricingRules: IPricingRule[];
}

export interface IBlockedTime {
  fromTime: string;
  toTime: string;
}

export interface IRefundRule {
  daysBefore: number;
  refundPercentage: number;
}

export interface IContact {
  name: string;
  phone: string;
  email?: string;
}

export interface ICancellation {
  policy: 'refundable' | 'nonRefundable';
  refundType?: 'fullRefund' | 'timeBasedRefund';
  refundRules: IRefundRule[];
}

export interface IRejectionEntry {
  _id: mongoose.Types.ObjectId;
  reason: string;
  rejectedAt: Date;
  rejectedBy: mongoose.Types.ObjectId;
  submissionNumber: number;
  editDeadline: Date;
  extendedAt?: Date;
  extendedBy?: mongoose.Types.ObjectId;
  originalDeadline?: Date;
}

// Main Interface
export interface IVenue extends Document {
  __v?: number;
  // Basic Info
  name: string;
  description: string;
  venueType: string;

  // Location
  address: string;
  city: string;
  district: string;
  pincode: string;
  location: IGeoPoint; // $geoNear / 2dsphere queries - future usecase
  googleMapsUrl?: string;

  // Space & Capacity
  spaceAttributes: string[];
  seatingConfigurations: string[];
  maxCapacity?: number;

  // Booking Config
  bookingType: 'fixedBooking' | 'flexibleBooking';
  fixedPackages?: IFixedPackage[];
  workingDays: string[];
  workingHours?: {
    open: string;
    close: string;
  };
  blockedTimes?: IBlockedTime[];
  blockedDates: Date[];
  flexibleBooking?: {
    slotDuration: number;
    bufferTime: number;
  };

  // Pricing
  pricing?: IPricing;

  // Amenities
  amenities: string[];

  // Media
  coverImage: string;
  galleryImages: string[];

  // Contact
  contact: IContact;

  // Cancellation & Refund
  cancellation: ICancellation;

  // Ratings & Reviews
  avgRating: number;
  reviewCount: number;

  pendingReview?: {
    intent: ReviewIntentType;
    requestedAt: Date;
    details: {
      changedFields?: string[];
      previousSnapshot?: Record<string, unknown>;
      reason?: string;
    };
  };

  inactivity?: {
    requestedAt?: Date;
    approvedAt?: Date;
    blockedAfterDate?: Date;
    inactiveAt?: Date;
    lastInactiveAt?: Date;
    withdrawalRequestedAt?: Date;
  };

  temporaryBlockAfterDate?: Date;

  // Operational
  status: VenueStatus;
  ownerUserId: mongoose.Types.ObjectId;
  rejectionHistory: IRejectionEntry[];
  submissionCount: number;
  lastSubmittedAt?: Date;
  currentEditDeadline?: Date;
  suspensionReason?: string;

  // Audit
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Soft delete
  active: boolean;
  deleted: boolean;
}

export type CreateVenueData = Omit<
  IVenue,
  | keyof mongoose.Document
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'active'
  | 'deleted'
  | 'rejectionHistory'
  | 'submissionCount'
  | 'lastSubmittedAt'
  | 'currentEditDeadline'
  | 'suspensionReason'
>;

export type UpdateVenueData = Partial<
  Omit<CreateVenueData, 'createdBy' | 'ownerUserId' | 'updatedBy'>
> & {
  updatedBy: string;
};

export interface AdminVenueFilters {
  status?: VenueStatus;
  city?: string;
  page: number;
  limit: number;
}

export interface PublicVenueFilters {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  venueType?: string[];
  district?: string;
  capacity?: number;
  spaceAttributes?: string[];
  seatingConfigurations?: string[];
  amenities?: string[];
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'distance';
  lat?: number;
  lng?: number;
  radiusKm?: number;
}
