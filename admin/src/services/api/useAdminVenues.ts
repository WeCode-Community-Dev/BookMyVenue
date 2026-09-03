import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { DEFAULT_PAGE_LIMIT } from "@/constants/pagination";
import type { VenuesResponse } from "@/types";

export function useAdminVenues(page: number, statusFilter: string) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(DEFAULT_PAGE_LIMIT),
  });
  if (statusFilter !== "All") params.append("status", statusFilter);

  return useApiQuery<VenuesResponse>(
    [...QUERY_KEYS.ADMIN_VENUES, page, statusFilter],
    { method: "GET", url: `${API_ENDPOINTS.ADMIN_VENUES}?${params}` },
  );
}

export function useApproveVenue() {
  const queryClient = useQueryClient();
  return useApiMutation<unknown, { id: string }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.VENUES}/${vars.id}/approve`,
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VENUES });
      },
    },
  );
}

export function useRejectVenue() {
  const queryClient = useQueryClient();
  return useApiMutation<
    unknown,
    { id: string; reason: string; extendedDeadline?: Date }
  >(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.VENUES}/${vars.id}/reject`,
      data: {
        rejectionReason: vars.reason,
        extendedDeadline: vars.extendedDeadline,
      },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VENUES });
      },
    },
  );
}

export function useExtendVenueDeadline() {
  const queryClient = useQueryClient();
  return useApiMutation<unknown, { id: string; newDeadline: Date }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.VENUES}/${vars.id}/extend-deadline`,
      data: { newDeadline: vars.newDeadline },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VENUES });
      },
    },
  );
}

export function useFeatureVenue() {
  const queryClient = useQueryClient();
  return useApiMutation<unknown, { id: string; durationDays: string }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.VENUES}/${vars.id}/feature`,
      data: { durationDays: vars.durationDays },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VENUES });
      },
    },
  );
}

export function useSuspendVenue() {
  const queryClient = useQueryClient();
  return useApiMutation<unknown, { id: string; suspensionReason: string }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.VENUES}/${vars.id}/deactivate`,
      data: { suspensionReason: vars.suspensionReason },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VENUES });
      },
    },
  );
}

export function useUnsuspendVenue() {
  const queryClient = useQueryClient();
  return useApiMutation<unknown, { id: string }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.VENUES}/${vars.id}/unsuspend`,
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VENUES });
      },
    },
  );
}
