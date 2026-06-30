import { API_ROUTES } from "@/constatnts/apiRoutes"
import api from "@/lib/axios"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    loading: true,
    error: null,
    venues: [],
    pagination: {
        venues: {
            totalPages: 0,
            totalCount: 0
        },
    }
}


export const getVenues = createAsyncThunk('user/venues', async(params = {}, { rejectWithValue}) => {
    try {
        console.log('params: ', params)
        const response = await api.get(API_ROUTES.USER.VENUE.VENUES, {
            params: {
                page: params.page || 1,
                limit: params.limit || 10,
                search: params.search || "",  
                category: params.category || undefined ,
                amenities: params.amenities,
                rating: params.rating || 0,
                capacityType: params.capacityType || "",
                capacity: params.capacity || "",
                priceType: params.priceType || "",
                minPrice: params.minPrice || "",
                maxPrice: params.maxPrice || ""
            },
            paramsSerializer: {
                indexes: null
            }
        })

        console.log('response: ', response.data.data)
        return response.data.data
    } catch (error) {
        return rejectWithValue("Failed to get venues", error)
    }
})


const userVenueSlice = createSlice({
    name: 'UserVenueSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder 
         .addCase(getVenues.pending, (state) => {
            state.loading = true
         })
         .addCase(getVenues.fulfilled, (state, action) => {
            state.loading = false
            state.venues = action.payload.data
            state.pagination.venues.totalCount = action.payload.totalCount
            state.pagination.venues.totalPages = action.payload.totalPages
         })
         .addCase(getVenues.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload 
         })
    }
})

export default userVenueSlice.reducer