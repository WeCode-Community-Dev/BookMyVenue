"use server";

import { unstable_cache } from "next/cache";
import { prisma, BookingStatus, VenueCategory, Prisma } from "@bookmyvenue/database";
import { mapBooking } from "./utils";

const SELECT_BOOKING = {
    id: true,
    purpose: true,
    status: true,
    user: {
        select: {
            name: true,
            email: true,
        },
    },
    venue: {
        select: {
            name: true,
            category: true,
            owner: {
                select: {
                    name: true,
                },
            },
        },
    },
    bookingSessions: {
        include: {
            session: true,
        },
    },
};

export type BookingWithRelations = Prisma.BookingGetPayload<{
    select: typeof SELECT_BOOKING;
}>;

export type BookingSession = BookingWithRelations["bookingSessions"][number];

export type Booking = {
    id: string;
    client: string;
    venue: string;
    owner: string;
    date: string;
    category: VenueCategory;
    purpose: string;
    amount: number;
    status: BookingStatus;
};

export type BookingPageResult = { bookings: Booking[]; total: number };

export const fetchBookings = unstable_cache(
    async (status: BookingStatus | "All", page: number, pageSize: number): Promise<BookingPageResult> => {
        const where = status === "All" ? {} : { status };
        
        const [rows, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                select: SELECT_BOOKING,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.booking.count(),
        ]);
        return { bookings: rows.map((r) => mapBooking(r)), total };
    },
    ["all-bookings"],
    { revalidate: 2 * 60, tags: ["bookings"] },
);
