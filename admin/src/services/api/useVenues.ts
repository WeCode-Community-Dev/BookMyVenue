import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import type { AvailabilityResponse } from "@/types";

export function useOwnerAvailability(venueId: string) {
  return useApiQuery<AvailabilityResponse>(
    QUERY_KEYS.OWNER_AVAILABILITY(venueId),
    {
      method: "GET",
      url: `${API_ENDPOINTS.OWNER_VENUE_BOOKINGS}/${venueId}/availability-calendar`,
    },
    { staleTime: 0, enabled: !!venueId },
  );
}

export function useBlockDates() {
  const queryClient = useQueryClient();
  return useApiMutation<unknown, { venueId: string; dates: string[] }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.OWNER_BLOCK_DATES}/${vars.venueId}/block-dates`,
      data: { dates: vars.dates },
    }),
    {
      onSuccess: (_, vars) => {
        queryClient.invalidateQueries({
          queryKey: ["owner", "availability", vars.venueId],
        });
      },
    },
  );
}

export function useUnblockDates() {
  const queryClient = useQueryClient();
  return useApiMutation<unknown, { venueId: string; dates: string[] }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.OWNER_UNBLOCK_DATES}/${vars.venueId}/unblock-dates`,
      data: { dates: vars.dates },
    }),
    {
      onSuccess: (_, vars) => {
        queryClient.invalidateQueries({
          queryKey: ["owner", "availability", vars.venueId],
        });
      },
    },
  );
}
