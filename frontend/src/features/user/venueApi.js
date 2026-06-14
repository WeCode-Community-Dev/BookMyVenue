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
  }),
});

export const { useGetUserVenuesQuery, useGetVenueDetailsQuery } = userAPi;
