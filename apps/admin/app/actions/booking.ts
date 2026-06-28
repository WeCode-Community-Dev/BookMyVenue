"use server";

import { unstable_cache } from "next/cache";
import { prisma, BookingStatus, VenueCategory } from "@bookmyvenue/database";
import { mapBooking, SELECT_BOOKING } from "./utils";



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
