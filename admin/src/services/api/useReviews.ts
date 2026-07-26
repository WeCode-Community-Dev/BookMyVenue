import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import type { ReviewsResponse } from "@/types";

export function useReviews(venueId: string, page: number) {
  return useApiQuery<ReviewsResponse>(
    QUERY_KEYS.OWNER_REVIEWS(venueId),
    {
      method: "GET",
      url: `${API_ENDPOINTS.OWNER_VENUE_BOOKINGS}/${venueId}/reviews?page=${page}&limit=10`,
    },
    { staleTime: 0, enabled: !!venueId },
  );
}

export function useReplyToReview() {
  const queryClient = useQueryClient();
  return useApiMutation<
    unknown,
    { venueId: string; reviewId: string; text: string }
  >(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.OWNER_VENUE_BOOKINGS}/${vars.venueId}/reviews/${vars.reviewId}/reply`,
      data: { text: vars.text },
    }),
    {
      onSuccess: (_, vars) => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.OWNER_REVIEWS(vars.venueId),
        });
      },
    },
  );
}

export function useReportReview() {
  const queryClient = useQueryClient();
  return useApiMutation<
    unknown,
    {
      venueId: string;
      reviewId: string;
      reason: string;
      action: "hide" | "flag";
    }
  >(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.OWNER_VENUE_BOOKINGS}/${vars.venueId}/reviews/${vars.reviewId}/report`,
      data: { reason: vars.reason, action: vars.action },
    }),
    {
      onSuccess: (_, vars) => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.OWNER_REVIEWS(vars.venueId),
        });
      },
    },
  );
}
