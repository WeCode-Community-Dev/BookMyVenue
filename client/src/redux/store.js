import { configureStore } from "@reduxjs/toolkit";
import userVenueSlice from './slices/UserVenueSlice'
import adminUserSlice from './slices/AdminUserSlice'

export const store = configureStore({
    reducer: {
        userVenue: userVenueSlice,
        adminUser: adminUserSlice
    }
})
