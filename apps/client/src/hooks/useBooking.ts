"use client";

import { fetchBookingsByOwnerId, fetchBookingsByUserId } from "@/lib/api/bookingApi";
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

export const useUserBookings = (params: GetBookingQuery) => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ["user-bookings", params],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error("Unauthorized");
            return fetchBookingsByUserId(params, token);
        },
    });
};
