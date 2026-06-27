import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, loginRequest, logoutRequest, registerRequest } from "@/api/auth-api";
import { useAuthStore } from "@/store/store";

export const AUTH_USER_QUERY_KEY = ["auth-user"];

export const useAuthUser = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: Infinity,
    enabled: !user,
  });
};

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (user) => setUser(user),
  });
};

export const useRegister = () =>
  useMutation({
    mutationFn: registerRequest,
  });

export const useLogout = () => {
  const clearUser = useAuthStore((state) => state.clearUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      clearUser();
      queryClient.removeQueries({ queryKey: AUTH_USER_QUERY_KEY });
    },
  });
};
