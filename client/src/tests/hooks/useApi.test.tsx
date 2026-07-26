import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const mockRequest = vi.fn();
const mockAxiosInstance = Object.assign(
  function (config: Record<string, unknown>) {
    return mockRequest(config);
  },
  {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    request: mockRequest,
    defaults: {} as Record<string, unknown>,
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
    },
  }
);

vi.mock('@/config/axios', () => ({
  axiosInstance: mockAxiosInstance,
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ error: vi.fn(), success: vi.fn(), info: vi.fn() }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useApiQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data and unwrap response.data.data', async () => {
    mockRequest.mockResolvedValue({
      data: { data: { id: 1, name: 'Test' } },
    });

    const { useApiQuery } = await import('../../hooks/useApi');

    const { result } = renderHook(
      () => useApiQuery<{ id: number; name: string }>(['test'], { method: 'GET', url: '/test' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 1, name: 'Test' });
    expect(mockRequest).toHaveBeenCalledWith({ method: 'GET', url: '/test' });
  });

  it('should fall back to response.data when data.data is undefined', async () => {
    mockRequest.mockResolvedValue({
      data: { message: 'ok' },
    });

    const { useApiQuery } = await import('../../hooks/useApi');

    const { result } = renderHook(() => useApiQuery(['test'], { method: 'GET', url: '/test' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ message: 'ok' });
  });

  it('should pass query options through', async () => {
    mockRequest.mockResolvedValue({
      data: { data: 'value' },
    });

    const { useApiQuery } = await import('../../hooks/useApi');
    const staleTime = 10000;
    const enabled = false;

    const { result } = renderHook(
      () => useApiQuery(['test'], { method: 'GET', url: '/test' }, { staleTime, enabled }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isFetching).toBe(false);
  });

  it('should accept string query key', async () => {
    mockRequest.mockResolvedValue({
      data: { data: 'result' },
    });

    const { useApiQuery } = await import('../../hooks/useApi');

    const { result } = renderHook(() => useApiQuery('test-key', { method: 'GET', url: '/test' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe('result');
  });
});

describe('useApiMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call mutation with config and merge variables as data', async () => {
    mockRequest.mockResolvedValue({
      data: { data: { id: 1 } },
    });

    const { useApiMutation } = await import('../../hooks/useApi');

    const { result } = renderHook(() => useApiMutation({ method: 'POST', url: '/create' }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ name: 'New Item' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/create',
      data: { name: 'New Item' },
    });
    expect(result.current.data).toEqual({ id: 1 });
  });

  it('should fail on network error', async () => {
    mockRequest.mockRejectedValue(new Error('Network Error'));

    const { useApiMutation } = await import('../../hooks/useApi');

    const { result } = renderHook(() => useApiMutation({ method: 'POST', url: '/fail' }), {
      wrapper: createWrapper(),
    });

    result.current.mutate({});

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
