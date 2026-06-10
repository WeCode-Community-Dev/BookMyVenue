import {baseApi} from "../../redux/api/baseApi"

export const ownerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addVenue: builder.mutation({
            query: (data) => ({
                url: '/venues',
                method: 'POST',
                body: data
            })
        })
    })
})

export const {useAddVenueMutation} = ownerApi