"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createVenueApi, type CreateVenuePayload } from "@/lib/api/venueApi";

export function useCreateVenue() {
    const { getToken } = useAuth();

    return useMutation({
        mutationFn: async (payload: CreateVenuePayload) => {
            const token = await getToken();
            if (!token) throw new Error("Not authenticated");
            return createVenueApi(payload, token);
        },
    });
}
