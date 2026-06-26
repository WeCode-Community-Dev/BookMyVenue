"use client";

import { useQuery } from "@tanstack/react-query";
import { getVenuesApi, getVenueByIdApi, type GetVenuesParams } from "@/lib/api/venue";

export function useVenues(params: GetVenuesParams = {}) {
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
