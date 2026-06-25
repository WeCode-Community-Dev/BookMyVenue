"use client";

import { useQuery } from "@tanstack/react-query";
import { getVenuesApi, type GetVenuesParams } from "@/lib/api/venue";

export function useVenues(params: GetVenuesParams = {}) {
    return useQuery({
        queryKey: ["venues", params],
        queryFn: () => getVenuesApi(params),
    });
}
