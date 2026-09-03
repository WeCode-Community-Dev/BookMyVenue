import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import type { Venue } from "@/types";

export function useVenueSettings(venueId: string) {
  return useApiQuery<Venue>(
    [...QUERY_KEYS.OWNER_VENUE_SETTINGS, venueId],
    {
      method: "GET",
      url: `${API_ENDPOINTS.OWNER_VENUE_SETTINGS}/${venueId}/settings`,
    },
    { enabled: !!venueId },
  );
}

export function useUpdateVenue() {
  const queryClient = useQueryClient();
  return useApiMutation<
    Venue,
    { id: string; data: Record<string, unknown>; idempotencyKey: string }
  >(
    (vars) => ({
      method: "PUT",
      url: `${API_ENDPOINTS.VENUES}/${vars.id}`,
      data: {
        ...vars.data,
        expectedVersion: (vars.data as Record<string, unknown>).expectedVersion,
      },
      headers: { "Idempotency-Key": vars.idempotencyKey } as Record<
        string,
        string
      >,
    }),
    {
      onSuccess: (_data, vars) => {
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.OWNER_VENUE_SETTINGS, vars.id],
        });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_VENUES });
      },
    },
  );
}

export function useRequestInactivity() {
  const queryClient = useQueryClient();
  return useApiMutation<Venue, { venueId: string; reason?: string }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.OWNER_VENUE_SETTINGS}/${vars.venueId}/request-inactivity`,
      data: { reason: vars.reason },
    }),
    {
      onSuccess: (_data, vars) => {
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.OWNER_VENUE_SETTINGS, vars.venueId],
        });
      },
    },
  );
}

export function useWithdrawInactivity() {
  const queryClient = useQueryClient();
  return useApiMutation<Venue, { venueId: string }>(
    (vars) => ({
      method: "DELETE",
      url: `${API_ENDPOINTS.OWNER_VENUE_SETTINGS}/${vars.venueId}/request-inactivity`,
    }),
    {
      onSuccess: (_data, vars) => {
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.OWNER_VENUE_SETTINGS, vars.venueId],
        });
      },
    },
  );
}

export function useBlockBookings() {
  const queryClient = useQueryClient();
  return useApiMutation<Venue, { venueId: string }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.OWNER_VENUE_SETTINGS}/${vars.venueId}/block-bookings`,
    }),
    {
      onSuccess: (_data, vars) => {
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.OWNER_VENUE_SETTINGS, vars.venueId],
        });
      },
    },
  );
}

export function useUnblockBookings() {
  const queryClient = useQueryClient();
  return useApiMutation<Venue, { venueId: string }>(
    (vars) => ({
      method: "DELETE",
      url: `${API_ENDPOINTS.OWNER_VENUE_SETTINGS}/${vars.venueId}/block-bookings`,
    }),
    {
      onSuccess: (_data, vars) => {
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.OWNER_VENUE_SETTINGS, vars.venueId],
        });
      },
    },
  );
}

export function useActivateVenue() {
  const queryClient = useQueryClient();
  return useApiMutation<Venue, { venueId: string }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.OWNER_VENUE_SETTINGS}/${vars.venueId}/activate`,
    }),
    {
      onSuccess: (_data, vars) => {
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.OWNER_VENUE_SETTINGS, vars.venueId],
        });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_VENUES });
      },
    },
  );
}

export function useRequestDeleteVenue() {
  const queryClient = useQueryClient();
  return useApiMutation<Venue, { venueId: string; reason: string }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.OWNER_VENUE_SETTINGS}/${vars.venueId}/delete-request`,
      data: { reason: vars.reason },
    }),
    {
      onSuccess: (_data, vars) => {
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.OWNER_VENUE_SETTINGS, vars.venueId],
        });
      },
    },
  );
}
