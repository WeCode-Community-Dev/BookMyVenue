"use server";

import { unstable_cache, revalidateTag } from "next/cache";
import { prisma, VerificationStatus, VenueCategory } from "@bookmyvenue/database";
import { mapVenue, SELECT_VENUE } from "./utils";
import { producer } from "../../lib/kafka";

export type VenueSession = {
    id: number;
    label: string;
    startTime: string;
    endTime: string;
    price: number;
    isActive: boolean;
};

export type Venue = {
    id: string;
    name: string;
    description: string;
    owner: string;
    location: string;
    district: string;
    category: VenueCategory;
    capacity: number;
    isActive: boolean;
    status: VerificationStatus;
    submitted: string;
    rating: number;
    bookings: number;
    images: string[];
    amenities: string[];
    sessions: VenueSession[];
};

export type VenuePageResult = { venues: Venue[]; total: number };

export const fetchAllVenues = unstable_cache(
    async (page: number, pageSize: number): Promise<VenuePageResult> => {
        const [rows, total] = await Promise.all([
            prisma.venue.findMany({
                select: SELECT_VENUE,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.venue.count(),
        ]);
        return { venues: rows.map((v) => mapVenue(v)), total };
    },
    ["all-venues"],
    { revalidate: 3 * 60, tags: ["venues"] },
);

export const fetchPendingVenues = unstable_cache(
    async (page: number, pageSize: number): Promise<VenuePageResult> => {
        const where = { verificationStatus: VerificationStatus.PENDING, isActive: true };
        const [rows, total] = await Promise.all([
            prisma.venue.findMany({
                where,
                select: SELECT_VENUE,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.venue.count({ where }),
        ]);
        return { venues: rows.map((v) => mapVenue(v)), total };
    },
    ["pending-venues"],
    { revalidate: 3 * 60, tags: ["venues"] },
);

export const fetchVenueById = unstable_cache(
    async (id: number): Promise<Venue | null> => {
        const row = await prisma.venue.findUnique({
            where: { id },
            select: SELECT_VENUE,
        });
        return row ? mapVenue(row) : null;
    },
    ["venue-by-id"],
    { revalidate: 3 * 60, tags: ["venues"] },
);

export async function approveVenue(id: string): Promise<void> {
    const venue = await prisma.venue.update({
        where: { id: Number(id) },
        data: { verificationStatus: VerificationStatus.APPROVED, verificationReason: null },
        select: {
            id: true,
            name: true,
            verificationStatus: true,
            owner: { select: { email: true, name: true } },
        },
    });

    await producer.send("venue-verification-updated", {
        venueId: venue.id,
        venueName: venue.name,
        status: venue.verificationStatus,
        reason: null,
        owner: venue.owner,
    });

    revalidateTag("venues", "default");
}

export async function rejectVenue(id: string, reason: string): Promise<void> {
    const venue = await prisma.venue.update({
        where: { id: Number(id) },
        data: { verificationStatus: VerificationStatus.REJECTED, verificationReason: reason },
        select: {
            id: true,
            name: true,
            verificationStatus: true,
            owner: { select: { email: true, name: true } },
        },
    });
    await producer.send("venue-verification-updated", {
        venueId: venue.id,
        venueName: venue.name,
        status: venue.verificationStatus,
        reason,
        owner: venue.owner,
    });
    revalidateTag("venues", "default");
}

export const fetchApproved = unstable_cache(
    async (page: number, pageSize: number): Promise<VenuePageResult> => {
        const where = { verificationStatus: VerificationStatus.APPROVED, isActive: true };
        const [rows, total] = await Promise.all([
            prisma.venue.findMany({
                where,
                select: SELECT_VENUE,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.venue.count({ where }),
        ]);
        return { venues: rows.map((v) => mapVenue(v)), total };
    },
    ["approved-venues"],
    { revalidate: 3 * 60, tags: ["venues"] },
);
