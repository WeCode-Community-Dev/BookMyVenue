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
  }),
});

export const {
  useGetUserVenuesQuery,
  useGetVenueDetailsQuery,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
} = userAPi;
