import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { DEFAULT_PAGE_LIMIT } from "@/constants/pagination";
import type { AdminsResponse } from "@/types";

export function useSuperAdmins(page: number) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(DEFAULT_PAGE_LIMIT),
  });

  return useApiQuery<AdminsResponse>([...QUERY_KEYS.SUPER_ADMINS, page], {
    method: "GET",
    url: `${API_ENDPOINTS.RBAC_ADMINS}?${params}`,
  });
}

export function usePromoteToAdmin() {
  const queryClient = useQueryClient();
  return useApiMutation<unknown, { email: string }>(
    (vars) => ({
      method: "POST",
      url: API_ENDPOINTS.RBAC_PROMOTE,
      data: { email: vars.email },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPER_ADMINS });
      },
    },
  );
}

export function useDemoteAdmin() {
  const queryClient = useQueryClient();
  return useApiMutation<unknown, { userId: string }>(
    (vars) => ({
      method: "POST",
      url: API_ENDPOINTS.RBAC_DEMOTE,
      data: { userId: vars.userId },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUPER_ADMINS });
      },
    },
  );
}
