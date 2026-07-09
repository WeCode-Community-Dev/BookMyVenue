import { baseApi } from '@/lib/api';

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVenueAvailability: builder.query({
      query: ({ venueId, from, to }) => ({
        url: `/venues/${venueId}/availability`,
        params: { from, to },
      }),
      transformResponse: (response) => response.data,
      providesTags: (_result, _error, { venueId }) => [
        { type: 'Venue', id: venueId },
        { type: 'Booking', id: `AVAIL-${venueId}` },
      ],
    }),
    getMyBookings: builder.query({
      query: () => '/bookings',
      transformResponse: (response) => response.data.bookings,
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'Booking', id })), { type: 'Booking', id: 'LIST' }] : [{ type: 'Booking', id: 'LIST' }],
    }),
    createBooking: builder.mutation({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
      transformResponse: (response) => response.data.booking,
      invalidatesTags: (_result, _error, { venueId }) => [
        { type: 'Booking', id: 'LIST' },
        { type: 'Booking', id: `AVAIL-${venueId}` },
        { type: 'Venue', id: venueId },
      ],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PATCH',
      }),
      transformResponse: (response) => response.data.booking,
      invalidatesTags: (result, _error, id) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' },
        { type: 'Venue', id: result?.venueId },
        { type: 'Booking', id: `AVAIL-${result?.venueId}` },
      ],
    }),
  }),
});

export const { useGetVenueAvailabilityQuery, useGetMyBookingsQuery, useCreateBookingMutation, useCancelBookingMutation } = bookingsApi;
