export interface Venue {
  _id: string;
  ownerId: string;
  categoryId: string | { _id: string; name: string };
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
    coordinates: number[];
  };
  capacity: number;
  isAvailabilityConfigured: boolean;
  availability?: AvailabilityConfig;
  amenities: string[];
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verifiedAt: string | null;
  rejectionReason: string | null;
  isActive: boolean;
  isFeatured?: boolean;
  pricing:{amount:number,unit:string}
  isElite?: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VenueQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'all';
  category?: string;
  sort?: 'asc' | 'desc';
  isDeleted?: 'true' | 'false';
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VenueListResponse {
  venues: Venue[];
  pagination: PaginationInfo;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AvailabilityConfig {
  _id?: string;
  venueId?: string;
  openingTime: string;
  closingTime: string;
  availableDays: number[];
  minBookingDuration: number;
  maxBookingDuration?: number | null;
  pricePerHour: number;
  bufferTime?: number;
}
