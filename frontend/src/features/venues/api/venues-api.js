import { baseApi } from '@/lib/api';

export const venuesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVenues: builder.query({
      query: ({ city } = {}) => ({
        url: '/venues',
        params: city ? { city } : undefined,
      }),
      transformResponse: (response) => response.data.venues,
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'Venue', id })), { type: 'Venue', id: 'LIST' }] : [{ type: 'Venue', id: 'LIST' }],
    }),
    getVenueById: builder.query({
      query: (id) => `/venues/${id}`,
      transformResponse: (response) => response.data.venue,
      providesTags: (_result, _error, id) => [{ type: 'Venue', id }],
    }),
  }),
});

export const { useGetVenuesQuery, useGetVenueByIdQuery } = venuesApi;
