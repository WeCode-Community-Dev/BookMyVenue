import { baseApi } from '@/lib/api';

export const ownerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerBookings: builder.query({
      query: () => '/owners/bookings',
      transformResponse: (response) => response.data.bookings,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'OwnerBooking', id })), { type: 'OwnerBooking', id: 'LIST' }]
          : [{ type: 'OwnerBooking', id: 'LIST' }],
    }),
  }),
});

export const { useGetOwnerBookingsQuery } = ownerApi;
