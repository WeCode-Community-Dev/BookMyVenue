"use client";

import { fetchBookingsByOwnerId, fetchBookingsByUserId, fetchOwnerDashboard } from "@/lib/api/bookingApi";
import type { GetOwnerBookingQuery, GetUserBookingQuery } from "@bookmyvenue/types";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export const useOwnerBookings = (params: GetOwnerBookingQuery) => {
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

export const useUserBookings = (params: GetUserBookingQuery) => {
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

export const useOwnerDashboard = () => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ["owner-dashboard"],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error("Unauthorized");
            return fetchOwnerDashboard(token);
        },
    });
};
