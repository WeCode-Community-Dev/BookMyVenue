import { baseApi } from "../../redux/api/baseApi";



export const authApi = baseApi.injectEndpoints({
    endpoints: (builder)=>({
        login: builder.mutation({
            query: (data) => ({
                url: '/auth/login',     
                method: 'POST',
                body: data,
            }),
        }),
        
         logout: builder.mutation({
            query: (data) => ({
                url: '/auth/logout',     
                method: 'POST',
                body: data,
            }),
        }),


        register: builder.mutation({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                body: data,
            })
        }),

        getMe: builder.query({
            query: () => ({
                url: '/auth/me',
                method: 'GET',
            })
        })

    })
})


export const {useLoginMutation, useRegisterMutation, useGetMeQuery, useLogoutMutation} = authApi;

