// ======================================================
// BOOK MY VENUE - FRONTEND TYPES
// ======================================================

import type { Pagination } from "./common";
import type { PaymentStatus } from "./payment.type";

export enum VenueStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SUSPENDED = "SUSPENDED",
}

export enum VenueType {
    AUDITORIUM = "AUDITORIUM",
    BANQUET_HALL = "BANQUET_HALL",
    CONFERENCE_ROOM = "CONFERENCE_ROOM",
    MEETING_ROOM = "MEETING_ROOM",
    CAFE = "CAFE",
    RESTAURANT = "RESTAURANT",
    HOTEL = "HOTEL",
    RESORT = "RESORT",
    PARTY_HALL = "PARTY_HALL",
    EVENT_SPACE = "EVENT_SPACE",
    OTHER = "OTHER",
}

// ======================================================
// COMMON
// ======================================================

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

// ======================================================
// USER
// ======================================================

export interface UserSummary {
    id: string;
    firstName: string;
    lastName?: string;
    email?: string;
    avatar?: string;
}

// ======================================================
// OWNER
// ======================================================

export interface VenueOwner {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
}

// ======================================================
// AMENITIES
// ======================================================

export interface Amenity {
    id: string;
    name: string;
    description?: string;
    icon?: string;
}

// ======================================================
// IMAGES
// ======================================================

export interface VenueImage {
    id: string;
    imageUrl: string;
    sortOrder: number;
}

// ======================================================
// REVIEWS
// ======================================================

export interface VenueReview {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    user: UserSummary;
}


// ======================================================
// VENUE LIST CARD
// ======================================================

export interface VenueCard {
    id: string;
    title: string;
    description?: string;
    venueType: VenueType | string;
    city: string;
    state: string;
    country: string;
    capacity: number;
    pricePerDay: number;
    thumbnail?: string;
    images?: string[];
    averageRating?: number;
    reviewCount?: number;
    isSaved?: boolean;
    status?: string;
    amenities?: string[];
}

// ======================================================
// VENUE DETAILS
// ======================================================

export interface VenueDetails {
    id: string;
    ownerId?: string;
    title: string;
    description: string;
    venueType: VenueType | string;
    status: string;
    // flat address fields returned by API
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    // nested address (optional, for backward compat)
    address?: Address;
    location?: Coordinates;
    capacity: number;
    pricePerDay: number;
    owner?: VenueOwner;
    amenities: string[];
    images: string[];
    averageRating?: number;
    reviewCount?: number;
    createdAt: string;
    updatedAt?: string;
}

// ======================================================
// VENUE SEARCH
// ======================================================

export interface VenueSearchFilters {
    query?: string;
    city?: string;
    state?: string;
    venueType?: string;
    minPrice?: number;
    maxPrice?: number;
    minCapacity?: number;
    maxCapacity?: number;
    amenities?: string[];
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    page?: number;
    limit?: number;
    sortBy?:
    | "price_asc"
    | "price_desc"
    | "rating_desc"
    | "newest";
}


// ======================================================
// AVAILABILITY
// ======================================================

export interface VenueAvailability {
    venueId: string;
    date: string;
    available: boolean;
}

export interface VenueAvailabilityRange {
    venueId: string;
    startDate: string;
    endDate: string;
    unavailableDates: string[];
}

// ======================================================
// SAVED VENUES
// ======================================================

export interface SavedVenue {
    id: string;
    createdAt: string;
    venue: VenueCard;
}

// ======================================================
// BOOKINGS
// ======================================================

export enum BookingStatus {
    BOOKED = "BOOKED",
    CANCELLED = "CANCELLED",
}

export interface BookingSummary {
    id: string;
    venueName: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    status: BookingStatus;
    paymentStatus: PaymentStatus
    createdAt: string;
    venue: VenueCard;
}

// ======================================================
// OWNER DASHBOARD
// ======================================================

export interface VenueAnalytics {
    venueId: string;
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    reviewCount: number;
    occupancyRate: number;
}

export interface OwnerVenue {
    id: string;
    title: string;
    venueType: string;
    status: VenueStatus;
    capacity: number;
    pricePerDay: number;
    totalBookings: number;
    totalRevenue: number;
    createdAt: string;
}

// ======================================================
// CREATE VENUE
// ======================================================

export interface CreateVenueRequest {
    title: string;
    description: string;
    venueType: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
    capacity: number;
    pricePerDay: number;
    amenityIds: string[];
    imageUrls: string[];
}

// ======================================================
// UPDATE VENUE
// ======================================================

export interface UpdateVenueRequest {
    title?: string;
    description?: string;
    venueType?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    capacity?: number;
    pricePerDay?: number;
    amenityIds?: string[];
    imageUrls?: string[];
}

// ======================================================
// API RESPONSES
// ======================================================

export interface VenueListResponse extends Pagination<VenueCard> { }

export interface VenueDetailsResponse {
    data: VenueDetails;
}

export interface VenueAnalyticsResponse {
    data: VenueAnalytics;
}


export interface BookingHistoryResponse extends Pagination<BookingSummary> { }