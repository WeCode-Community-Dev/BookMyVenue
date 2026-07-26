import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { DEFAULT_PAGE_LIMIT } from "@/constants/pagination";
import type { UsersResponse } from "@/types";
import type { UserProfile } from "@/components/guards/AuthGuard";

export function useAdminUsers(page: number, role?: string) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(DEFAULT_PAGE_LIMIT),
  });
  if (role) params.append("role", role);

  return useApiQuery<UsersResponse>(
    [...QUERY_KEYS.ADMIN_OWNERS, role ? `users-${role}` : "all-users", page],
    { method: "GET", url: `${API_ENDPOINTS.ADMIN_USERS}?${params}` },
  );
}

export function useProfile() {
  return useApiQuery<UserProfile>(
    QUERY_KEYS.PROFILE,
    { method: "GET", url: API_ENDPOINTS.PROFILE },
    { staleTime: Infinity },
  );
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useApiMutation<{ active: boolean }, { userId: string }>(
    (vars) => ({
      url: `${API_ENDPOINTS.TOGGLE_USER_STATUS}/${vars.userId}/toggle-status`,
      method: "PATCH",
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_OWNERS });
      },
    },
  );
}

export function useChangePassword() {
  return useApiMutation<unknown, { oldPassword: string; newPassword: string }>(
    (vars) => ({
      url: API_ENDPOINTS.CHANGE_PASSWORD,
      method: "PATCH",
      data: vars,
    }),
  );
}

export function useResetPassword() {
  return useApiMutation<unknown, { userId: string }>((vars) => ({
    url: `${API_ENDPOINTS.RESET_PASSWORD}/${vars.userId}/reset-password`,
    method: "POST",
  }));
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useApiMutation<
    unknown,
    {
      userId: string;
      scope: string;
      reason: string;
      venueId?: string | null;
      expiresAt?: string | null;
    }
  >(
    (vars) => ({
      url: API_ENDPOINTS.MODERATION_BANS,
      method: "POST",
      data: {
        userId: vars.userId,
        scope: vars.scope,
        reason: vars.reason,
        venueId: vars.venueId || undefined,
        expiresAt: vars.expiresAt || undefined,
      },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_OWNERS });
      },
    },
  );
}
