import {baseApi} from "../../redux/api/baseApi"

export const ownerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addVenue: builder.mutation({
            query: (data) => ({
                url: '/venues',
                method: 'POST',
                body: data
            })
        }),

        getOwnerVenues: builder.query({
            query: () => ({
                url: '/owner/venues'
            }),
            providesTags: ['OwnerVenues'],
        }),

        getVenueDetails: builder.query({
            query: (venueId) => ({
                url: `/venue/${venueId}`,
            }),
            providesTags: (result, error, venueId) => [{ type: 'OwnerVenue', id: venueId }],
        }),

        updateVenue: builder.mutation({
            query: ({ venueId, payload }) => ({
                url: `/venues/${venueId}`,
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: (result, error, { venueId }) => [
              { type: 'OwnerVenue', id: venueId },
              'OwnerVenues',
            ],
        }),

        getOwnerBookings: builder.query({
            query: (ownerId) => ({
                url: `/bookings/owner/${ownerId}`,
            }),
            providesTags: ['OwnerBookings'],
        }),

        getAmenities: builder.query({
            query: () => ({
                url: '/amenities'
            })
        }),

        submitVenue: builder.mutation({
            query: (venueId) => ({
                url: `/owner/venue/${venueId}/submit`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, venueId) => [
              { type: 'OwnerVenue', id: venueId },
              'OwnerVenues',
            ],
        }),

        deactivateVenue: builder.mutation({
            query: (venueId) => ({
                url: `/admin/${venueId}/deactivate`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, venueId) => [
              { type: 'OwnerVenue', id: venueId },
              'OwnerVenues',
            ],
        }),

        activateVenue: builder.mutation({
            query: (venueId) => ({
                url: `/admin/${venueId}/activate`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, venueId) => [
              { type: 'OwnerVenue', id: venueId },
              'OwnerVenues',
            ],
        })
    })
})

export const {
  useAddVenueMutation,
  useGetOwnerVenuesQuery,
  useGetVenueDetailsQuery,
  useUpdateVenueMutation,
  useGetOwnerBookingsQuery,
  useGetAmenitiesQuery,
  useSubmitVenueMutation,
  useDeactivateVenueMutation,
  useActivateVenueMutation,
} = ownerApi;