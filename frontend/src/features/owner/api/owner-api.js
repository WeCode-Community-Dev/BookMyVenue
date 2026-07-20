import {baseApi} from "@/lib/api";

const ownerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllBookings: build.query({
      query: () => '/owners/bookings',
      transformResponse: (response) => response.data.bookings,
      // providesTags: ['OwnerBooking']      
    }),
  }),
});

export const { useGetAllBookingsQuery } = ownerApi;
