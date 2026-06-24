import { VenueCategory, VerificationStatus } from "@bookmyvenue/database";
import { VenueStatus } from "../../components/data";
import { Venue } from "./venues";

export const SELECT = {
    id: true,
    name: true,
    description: true,
    location: true,
    district: true,
    category: true,
    capacity: true,
    images: true,
    amenities: true,
    verificationStatus: true,
    isActive: true,
    createdAt: true,
    owner: { select: { email: true } },
    sessions: {
        select: {
            id: true,
            label: true,
            startTime: true,
            endTime: true,
            price: true,
            isActive: true,
        },
        orderBy: { price: "asc" as const },
    },
    reviews: { select: { rating: true } },
    _count: { select: { bookings: true } },
} as const;

function deriveStatus(verificationStatus: VerificationStatus, isActive: boolean): VenueStatus {
    if (verificationStatus === VerificationStatus.REJECTED) return "Rejected";
    if (!isActive) return "Inactive";
    if (verificationStatus === VerificationStatus.PENDING) return "Pending";
    return "Approved";
}

export function mapVenue(v: {
    id: number;
    name: string;
    description: string;
    location: string;
    district: string;
    category: VenueCategory;
    capacity: number;
    images: string[];
    amenities: string[];
    verificationStatus: VerificationStatus;
    isActive: boolean;
    createdAt: Date;
    owner: { email: string };
    sessions: { id: number; label: string; startTime: string; endTime: string; price: number; isActive: boolean }[];
    reviews: { rating: number }[];
    _count: { bookings: number };
}, status?: VenueStatus): Venue {
    return {
        id: String(v.id),
        name: v.name,
        description: v.description,
        owner: v.owner.email,
        location: v.location,
        district: v.district,
        category: v.category,
        capacity: v.capacity,
        status: status ?? deriveStatus(v.verificationStatus, v.isActive),
        submitted: v.createdAt.toISOString().split("T")[0]!,
        rating: v.reviews.length ? v.reviews.reduce((sum, r) => sum + r.rating, 0) / v.reviews.length : 0,
        bookings: v._count.bookings,
        images: v.images,
        amenities: v.amenities,
        sessions: v.sessions,
    };
}