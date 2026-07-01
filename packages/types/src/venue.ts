import { District, VenueCategory, VerificationStatus } from "@bookmyvenue/database";

export const DISTRICTS = [
    "THIRUVANANTHAPURAM",
    "KOLLAM",
    "PATHANAMTHITTA",
    "ALAPPUZHA",
    "KOTTAYAM",
    "IDUKKI",
    "ERNAKULAM",
    "THRISSUR",
    "PALAKKAD",
    "MALAPPURAM",
    "KOZHIKODE",
    "WAYANAD",
    "KANNUR",
    "KASARAGOD",
] as const;

export const VENUE_CATEGORIES = [
    "WEDDING_HALL",
    "CONFERENCE_HALL",
    "PARTY_HALL",
    "CAFE",
    "RESTAURANT",
    "AUDITORIUM",
    "SPORTS_GROUND",
    "MEETING_ROOM",
    "OTHER",
] as const;

export interface SessionInput {
    label: string;
    startTime: string;
    endTime: string;
    price: number;
}

export interface CreateVenuePayload {
    name: string;
    description: string;
    capacity: number;
    category: string;
    location: string;
    district: string;
    images: string[];
    amenities: string[];
    sessions: SessionInput[];
}

export type VenueSession = {
    id: number;
    label: string;
    startTime: string;
    endTime: string;
    price: number;
};

export type VenueOwner = {
    id: string;
    email: string;
    name: string | null;
};

export interface Venue {
    id: number;
    name: string;
    description: string;
    capacity: number;

    images: string[];
    amenities: string[];

    category: VenueCategory;
    district: District;
    location: string;

    ownerId: string;

    verificationStatus: VerificationStatus;
    verificationReason: string | null;

    sessions: VenueSession[];

    isActive: boolean;

    createdAt: string;
    updatedAt: string;

    bookingCount: number;

    reviewCount: number;
    averageRating: number | null;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetVenuesResponse {
    venues: Venue[];
    pagination: Pagination;
}

export interface VenueReview {
    id: number;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { id: number; email: string };
}

export interface VenueDetail extends Venue {
    // sessions: VenueSession[];
    owner: VenueOwner;
}

export interface GetVenueByIdResponse {
    venue: VenueDetail;
}

export interface CreateVenueBody {
    name: string;
    description: string;
    capacity: number;
    category: VenueCategory;
    location: string;
    district: District;
    images: string[];
    amenities: string[];
    sessions: SessionInput[];
}

export interface EditVenueBody {
    name?: string;
    description?: string;
    capacity?: number;
    category?: VenueCategory;
    location?: string;
    district?: District;
    images?: string[];
    amenities?: string[];
}

export interface GetVenuesQuery {
    district?: District;
    category?: VenueCategory;
    page?: number;
    limit?: number;
}
