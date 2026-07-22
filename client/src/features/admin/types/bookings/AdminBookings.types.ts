import type { Category } from '@/features/categories/types';

export interface AdminBookingStats {
  total: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
}

export interface BookingsStatsProps {
  stats: AdminBookingStats;
  loading: boolean;
}

export interface BookingsToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  categories: Category[];
}


export type BookingStatus = 'RESERVED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';

export interface CategoryInfo {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  image_public_id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CustomerInfo {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  authProvider: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface VenueInfo {
  _id: string;
  ownerId: string;
  categoryId: string;
  name: string;
  description: string;
  // Add other venue fields here if needed based on your schema
}

export interface OwnerUserInfo {
  _id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  // Add other owner fields here if needed
}

export interface Booking {
  _id: string;
  bookingId: string;
  bookingStatus: BookingStatus;
  bookingScenario: string;
  
  // Date fields
  createdAt: string;
  updatedAt: string;
  startDateTime: string;
  endDateTime: string;
  autoCancellationDate: string;
  remainingPaymentDueDate: string;
  cancelledAt: string | null;
  
  // Nested Objects
  categoryInfo: CategoryInfo;
  customerInfo: CustomerInfo;
  venueInfo: VenueInfo;
  ownerUserInfo?: OwnerUserInfo; // Optional in case backend doesn't always populate
  
  // IDs
  user: string;
  venue: string;
  
  // Contact Info
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  
  // Financials
  totalAmount: number;
  amountPaid: number;
  reservationDeposit: number;
  remainingBalance: number;
  refundAmount: number;
  
  // Payment & Status
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  refundStatus: string;
  settlementStatus: string | null;
  isImmediatePaymentRequired: boolean;
  cancellationReason: string;
  cancellationType: string | null;
  specialRequests: string;
  
  guests: number;
  __v?: number;
}

export interface BookingsTableProps {
  bookings: Booking[];
}



export interface AdminBookingQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  sort?: string;
}