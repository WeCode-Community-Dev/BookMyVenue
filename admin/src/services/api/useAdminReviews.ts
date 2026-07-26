import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import type { Venue } from "@/types";

export function useAdminReviews() {
  return useApiQuery<{ count: number; venues: Venue[] }>(
    QUERY_KEYS.ADMIN_REVIEWS,
    { method: "GET", url: `${API_ENDPOINTS.VENUES}/reviews` },
  );
}

export function useApproveReview() {
  const queryClient = useQueryClient();
  return useApiMutation<Venue, { id: string; note?: string }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.VENUES}/${vars.id}/approve-review`,
      data: { note: vars.note },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_REVIEWS });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VENUES });
      },
    },
  );
}

export function useRejectReview() {
  const queryClient = useQueryClient();
  return useApiMutation<Venue, { id: string; note: string }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.VENUES}/${vars.id}/reject-review`,
      data: { note: vars.note },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_REVIEWS });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VENUES });
      },
    },
  );
}
