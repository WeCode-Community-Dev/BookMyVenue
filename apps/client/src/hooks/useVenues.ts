"use client";

import { useQuery } from "@tanstack/react-query";
import { getVenuesApi, getVenueByIdApi } from "@/lib/api/venueApi";
import type { GetVenuesQuery } from "@bookmyvenue/types";

export function useVenues(params: GetVenuesQuery = {}) {
    return useQuery({
        queryKey: ["venues", params],
        queryFn: () => getVenuesApi(params),
    });
}

export function useVenue(id: number | string) {
    return useQuery({
        queryKey: ["venue", String(id)],
        queryFn: () => getVenueByIdApi(id),
        enabled: id !== undefined && id !== null && id !== "",
    });
}
