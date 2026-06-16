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
} = userAPi;
