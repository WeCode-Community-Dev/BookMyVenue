import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "./useApi";
import { API_ENDPOINTS } from "@/constants";
import { QUERY_KEYS } from "@/config/queryKeys";
import { useToast } from "@/hooks/useToast";

import type { ReviewActionDialogState } from "@/types/ui";

export function useModeration(
  setReviewDialog: (opts: ReviewActionDialogState) => void,
  setReviewReason: (val: string) => void,
) {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const moderateReviewMutation = useApiMutation<
    unknown,
    {
      reviewId: string;
      action: "remove" | "restore" | "approve_hide" | "reject_hide";
      reason?: string;
    }
  >(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.REVIEWS}/${vars.reviewId}/moderate`,
      data: { action: vars.action, reason: vars.reason },
    }),
    {
      onSuccess: () => {
        success("Review moderated successfully");
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MODERATION_SUMMARY,
        });
        setReviewDialog({ open: false, action: "remove", reviewId: null });
        setReviewReason("");
      },

      onError: (err: unknown) => {
        const axiosErr = err as import("axios").AxiosError<{
          message: string;
        }>;
        error(axiosErr.response?.data?.message || "Failed to moderate review");
      },
    },
  );

  const unsuspendVenueMutation = useApiMutation<unknown, { venueId: string }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.VENUES}/${vars.venueId}/unsuspend`,
    }),
    {
      onSuccess: () => {
        success("Venue unsuspended successfully");
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MODERATION_SUMMARY,
        });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VENUES });
      },

      onError: (err: unknown) => {
        const axiosErr = err as import("axios").AxiosError<{
          message: string;
        }>;
        error(axiosErr.response?.data?.message || "Failed to unsuspend venue");
      },
    },
  );

  const unbanUserMutation = useApiMutation<unknown, { userId: string }>(
    (vars) => ({
      method: "POST",
      url: `${API_ENDPOINTS.MODERATION_BANS}/user/${vars.userId}/lift-all`,
    }),
    {
      onSuccess: () => {
        success("User unbanned successfully");
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MODERATION_SUMMARY,
        });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_OWNERS });
      },

      onError: (err: unknown) => {
        const axiosErr = err as import("axios").AxiosError<{
          message: string;
        }>;
        error(axiosErr.response?.data?.message || "Failed to unban user");
      },
    },
  );

  return { moderateReviewMutation, unsuspendVenueMutation, unbanUserMutation };
}
