import { configureStore } from "@reduxjs/toolkit";
import userVenueSlice from './slices/UserVenueSlice'

export const store = configureStore({
    reducer: {
        userVenue: userVenueSlice
    }
})
