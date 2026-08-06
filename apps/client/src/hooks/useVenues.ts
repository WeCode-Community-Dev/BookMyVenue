"use client";

import { useQuery } from "@tanstack/react-query";
import { getVenuesApi, getVenueByIdApi, getOwnerVenuesApi } from "@/lib/api/venueApi";
import type { GetVenuesQuery } from "@bookmyvenue/types";

export function useVenues(params: GetVenuesQuery = {}) {
    return useQuery({
        queryKey: ["venues", params],
        queryFn: () => getVenuesApi(params),
    });
}

export function useVenue(id: number | string) {
    return useQuery({
        queryKey: ["venue", id],
        queryFn: async () => {
            return getVenueByIdApi(id);
        },

        enabled: id !== undefined && id !== null && id !== "",
    });
}

export function useOwnerVenues(params: GetVenuesQuery = {}, token: string) {
    return useQuery({
        queryKey: ["owner-venues", params],
        queryFn: () => getOwnerVenuesApi(params, token),
        enabled: !!token,
    });
}
