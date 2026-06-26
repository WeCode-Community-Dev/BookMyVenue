"use client";

import { fetchBookingsByOwnerId } from "@/lib/api/bookingApi";
import type { GetBookingQuery } from "@bookmyvenue/types";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export const useOwnerBookings = (params: GetBookingQuery) => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ["venue-bookings", params],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error("Unauthorized");
            return fetchBookingsByOwnerId(params, token);
        },
    });
};
