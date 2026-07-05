import { District, VenueCategory, VerificationStatus } from "@bookmyvenue/database/enums";

export const DISTRICTS: District[] = Object.values(District);

export const VENUE_CATEGORIES: VenueCategory[] = Object.values(VenueCategory);

export interface SessionInput {
    id?: number;
    label: string;
    startTime: string;
    endTime: string;
    price: number;
    isActive?: boolean;
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

// export type VenueSession = {
//     id: number;
//     label: string;
//     startTime: string;
//     endTime: string;
//     price: number;
// };

export type VenueOwner = {
    id: string;
    email: string;
    name: string | null;
};

export type BookedSessionsByDate = Record<string, number[]>;
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

    sessions: SessionInput[];

    isActive: boolean;

    createdAt: string;
    updatedAt: string;

    bookingCount: number;

    reviewCount: number;
    averageRating: number | null;

    disabledDates: number[];
    bookedSessions: BookedSessionsByDate;
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
    name: string;
    description: string;
    capacity: number;
    images: string[];
    amenities: string[];
    category: VenueCategory;
    location: string;
    district: District;

    sessions: SessionInput[];
}

export interface GetVenuesQuery {
    district?: District;
    category?: VenueCategory;
    page?: number;
    limit?: number;
}
