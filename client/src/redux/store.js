import { configureStore } from "@reduxjs/toolkit";
import userVenueSlice from './slices/UserVenueSlice'
import UserProfileSlice from "./slices/UserProfileSlice";
import UserWishlistSlice from "./slices/UserWishlistSlice";
import adminUserSlice from './slices/AdminUserSlice';
import adminVendorSlice from './slices/AdminvendorSlice';
import VendorVenueSlice from './slices/VendorVenueSlice';
import VendorDashboardSlice from './slices/VendorDashboardSlice'

export const store = configureStore({
    reducer: {
        userVenue: userVenueSlice,
        adminUser: adminUserSlice,
        userProfile: UserProfileSlice,
        userWishlist: UserWishlistSlice,
        adminVendor: adminVendorSlice,
        vendorVenue: VendorVenueSlice,
        vendorDashboard: VendorDashboardSlice,

        
    }
})



