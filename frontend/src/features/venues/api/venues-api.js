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
    createVenue: builder.mutation({
      query: (body) => ({
        url: '/venues',
        method: 'POST',
        body,
      }),
      transformResponse: (response) => response.data.venue,
      invalidatesTags: [{ type: 'Venue', id: 'LIST' }],
    }),
    updateVenue: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/venues/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response) => response.data.venue,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Venue', id },
        { type: 'Venue', id: 'LIST' },
      ],
    }),
    deleteVenue: builder.mutation({
      query: (id) => ({
        url: `/venues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Venue', id },
        { type: 'Venue', id: 'LIST' },
        { type: 'OwnerBooking', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetVenuesQuery, useGetVenueByIdQuery, useCreateVenueMutation, useUpdateVenueMutation, useDeleteVenueMutation } = venuesApi;
