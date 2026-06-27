import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5005/',
    credentials: 'include'
  }),

  tagTypes: [
    'PendingVenues',   
    'AdminVenue',      
    'AdminStats', 
  ],

  endpoints: () => ({}),
})