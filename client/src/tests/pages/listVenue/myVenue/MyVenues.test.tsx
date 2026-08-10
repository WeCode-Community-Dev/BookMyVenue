import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';

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

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        retry: false,
      },
    },
  });
}

async function renderMyVenues(queryClient: QueryClient) {
  const mod = await import('@/pages/listVenue/myVenue');
  const MyVenues = mod.default;

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <MyVenues />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('MyVenues page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it(
    'refetches the venue list on mount so a newly created venue is not blank on return',
    async () => {
    const empty = { data: { data: { count: 0, venues: [] } } };
    const afterCreate = {
      data: {
        data: {
          count: 1,
          venues: [
            {
              _id: 'v1',
              name: 'Grand Palace Hall',
              city: 'Mumbai',
              district: 'Mumbai',
              state: 'Maharashtra',
              venueType: 'Wedding',
              coverImage: '',
              status: 'PendingReview',
              rejectionHistory: [],
              submissionCount: 1,
              createdAt: new Date().toISOString(),
            },
          ],
        },
      },
    };
    mockRequest.mockResolvedValueOnce(empty).mockResolvedValueOnce(afterCreate);

    const queryClient = makeQueryClient();

    // First mount: page loads and shows the empty state.
    const first = await renderMyVenues(queryClient);
    await waitFor(() => expect(mockRequest).toHaveBeenCalledTimes(1));

    // Simulate navigating away (component unmounts)...
    first.unmount();

    // ...then navigating back after creating a venue. The cached result is
    // still fresh (staleTime=5min), so without refetchOnMount:'always' this
    // second mount would NOT hit the API and would keep showing stale/blank
    // data even though the venue was just created.
    await renderMyVenues(queryClient);
    await waitFor(() => expect(mockRequest).toHaveBeenCalledTimes(2));

    expect(await screen.findByText('Grand Palace Hall')).toBeInTheDocument();
    },
    20000
  );
});