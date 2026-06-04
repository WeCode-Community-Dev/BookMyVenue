import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL, VENUE_URL } from "../../constants/constant";
export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        addVenue: builder.mutation({
            query: (data) => ({
                url: `${VENUE_URL}/add`,
                method: "POST",
                body: data,
            })
        })
    }),
})

export const {useAddVenueMutation}=api