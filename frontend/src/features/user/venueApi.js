import { baseApi } from "../../redux/api/baseApi";

export const userAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserVenues: builder.query({
      // args: { page, pageSize, search, type, city, capacity }
      query: (params = {}) => ({
        url: "/venues",
        params,
      }),
      // keepUnusedDataFor: 60,
    }),

    getVenueDetails: builder.query({
      query: (venueId) => ({
        url: `/venue/${venueId}`,
      }),
    }),

    getFavorites: builder.query({
      query: () => ({
        url: "/favorites",
      }),
    }),
    addFavorite: builder.mutation({
      query: (venueId) => ({
        url: `/favorites/${venueId}`,
        method: 'POST',
      }),
    }),

    deleteFavorite: builder.mutation({
      query: (venueId) => ({
        url: `/favorites/${venueId}`,
        method: 'DELETE',
      }),
    }),

    createBooking: builder.mutation({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
    }),

    verifyPayment: builder.query({
      query: (bookingId) => ({
        url: `/payments/verify/${bookingId}`,
      }),
    }),

    getUserBookings: builder.query({
      query: (userId) => ({
        url: `/bookings/${userId}`,
      }),
      providesTags: ['UserBookings'],
    }),

    getVenueAvailability: builder.query({
  query: ({ venueId, month }) => ({
    url: `/venue/${venueId}/availability`,
    params: { month },
  }),
  serializeQueryArgs: ({ queryArgs }) => {
    return `${queryArgs.venueId}-${queryArgs.month}`
  },
}),


  }),
});

export const {
  useGetUserVenuesQuery,
  useGetVenueDetailsQuery,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useCreateBookingMutation,
  useVerifyPaymentQuery,
  useGetUserBookingsQuery,
  useGetVenueAvailabilityQuery
} = userAPi;
