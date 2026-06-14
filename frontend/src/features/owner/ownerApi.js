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
            query: () =>( {
                url: '/owner/venues'

            })
        })
    })
})

export const {useAddVenueMutation, useGetOwnerVenuesQuery} = ownerApi