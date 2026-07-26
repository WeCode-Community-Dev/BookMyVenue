import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { axiosInstance } from '@/config/axios';
import { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useToast } from './useToast';

// Error message helper
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    return (
      (data?.message as string) || (data?.error as string) || error.message || 'Request failed'
    );
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
};

// Generic query hook
export function useApiQuery<T = unknown>(
  key: string | string[],
  config: AxiosRequestConfig,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await axiosInstance(config);
      return response.data?.data ?? response.data;
    },
    retry: (failureCount, error: unknown) => {
      if (error instanceof AxiosError && error.response?.status === 401) return false;
      return failureCount < 3;
    },
    ...options,
  });
}

// Generic mutation hook
export function useApiMutation<T = unknown, TVariables = unknown>(
  configOrBuilder: AxiosRequestConfig | ((variables: TVariables) => AxiosRequestConfig),
  options?: UseMutationOptions<T, Error, TVariables>
) {
  const { error: showError } = useToast();

  return useMutation<T, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const config =
        typeof configOrBuilder === 'function'
          ? configOrBuilder(variables)
          : { ...configOrBuilder, data: variables };
      try {
        const response = await axiosInstance(config);
        return response.data?.data ?? response.data;
      } catch (error) {
        showError(getErrorMessage(error));
        throw error;
      }
    },
    ...options,
  });
}
