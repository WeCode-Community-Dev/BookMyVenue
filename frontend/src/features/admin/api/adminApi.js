import { baseApi } from '../../../redux/api/baseApi.js'

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ─── Auth ─────────────────────────────────────────────────────────

    adminLogin: builder.mutation({
      query: (body) => ({
        url: '/auth/admin/login',
        method: 'POST',
        body,  // { email, password }
      }),
    }),

    getAdminMe: builder.query({
      query: () => ({
        url: '/auth/me',
      }),
    }),

    adminLogoutApi: builder.mutation({
      query: () => ({
        url: '/admin/logout',
        method: 'POST',
      }),
    }),

    // ─── Dashboard ────────────────────────────────────────────────────

    getAdminStats: builder.query({
      query: () => ({
        url: '/admin/dashboard/stats',
      }),
      providesTags: ['AdminStats'],
    }),

    // ─── Venue Approvals ──────────────────────────────────────────────

    getPendingVenues: builder.query({
      query: (params = {}) => ({
        url: '/admin/venues/pending',
        params,  // { page, pageSize } — pagination ready
      }),
      providesTags: ['PendingVenues'],
    }),

    getAdminVenueDetail: builder.query({
      query: (venueId) => ({
        url: `/admin/venues/${venueId}`,
      }),
      providesTags: (result, error, venueId) => [
        { type: 'AdminVenue', id: venueId }
      ],
    }),

    approveVenue: builder.mutation({
      query: (venueId) => ({
        url: `/admin/venues/${venueId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, venueId) => [
        'PendingVenues',
        'AdminStats',
        { type: 'AdminVenue', id: venueId },
      ],
    }),

    rejectVenue: builder.mutation({
      query: ({ venueId, reason }) => ({
        url: `/admin/venues/${venueId}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: (result, error, { venueId }) => [
        'PendingVenues',
        'AdminStats',
        { type: 'AdminVenue', id: venueId },
      ],
    }),

  }),
})

export const {
  useAdminLoginMutation,
  useGetAdminMeQuery,
  useAdminLogoutApiMutation,
  useGetAdminStatsQuery,
  useGetPendingVenuesQuery,
  useGetAdminVenueDetailQuery,
  useApproveVenueMutation,
  useRejectVenueMutation,
} = adminApi    