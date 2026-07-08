import { configureStore } from "@reduxjs/toolkit";
import userVenueSlice from './slices/UserVenueSlice'
import adminUserSlice from './slices/AdminUserSlice'
import adminVendorSlice from './slices/AdminvendorSlice'

export const store = configureStore({
    reducer: {
        userVenue: userVenueSlice,
        adminUser: adminUserSlice,
        adminVendor: adminVendorSlice
        
    }
})
