import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";

// Generic query hook
export function useApiQuery<T = unknown>(
  key: QueryKey,
  config: AxiosRequestConfig,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
) {
  return useQuery<T>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await axiosInstance(config);
      return response.data?.data ?? response.data;
    },
    retry: (failureCount, error: unknown) => {
      if (error instanceof AxiosError && error.response?.status === 401)
        return false;
      return failureCount < 3;
    },
    ...options,
  });
}

// Generic mutation hook
export function useApiMutation<T = unknown, TVariables = unknown>(
  configOrBuilder:
    | AxiosRequestConfig
    | ((variables: TVariables) => AxiosRequestConfig),
  options?: Omit<UseMutationOptions<T, Error, TVariables>, "mutationFn">,
) {
  return useMutation<T, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      // If a function is passed, use it to build the config (URL, method, data).
      // Otherwise, fall back to the old behavior of merging the variables into the data property.
      const config =
        typeof configOrBuilder === "function"
          ? configOrBuilder(variables)
          : { ...configOrBuilder, data: variables };

      const response = await axiosInstance(config);
      return response.data?.data ?? response.data;
    },
    ...options,
  });
}
