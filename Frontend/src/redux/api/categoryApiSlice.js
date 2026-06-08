import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL, CATEGORY_URL } from "../../constants/constant";
export const categoryApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        addCategory: builder.mutation({
            query: (data) => ({
                url: `${CATEGORY_URL}/add`,
                method: "POST",
                body: data,
            })
        }),
        listCategories: builder.query({
            query: () => ({
                url: `${CATEGORY_URL}/categories`,
            }),
        }),
    }),
})

export const { useAddCategoryMutation,useListCategoriesQuery } = categoryApi