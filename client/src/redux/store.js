import { configureStore } from "@reduxjs/toolkit";
import userVenueSlice from './slices/UserVenueSlice'
import UserProfileSlice from "./slices/UserProfileSlice";
import UserWishlistSlice from "./slices/UserWishlistSlice";
import adminUserSlice from './slices/AdminUserSlice'
import adminVendorSlice from './slices/AdminvendorSlice'
import adminVenueSlice from './slices/AdminVenueSlice'
import adminBookingSlice from './slices/AdminBookingSlice'
import adminPaymentSlice from './slices/AdminPaymentSlice'

export const store = configureStore({
    reducer: {
        userVenue: userVenueSlice,
        adminUser: adminUserSlice,
        userProfile: UserProfileSlice,
        userWishlist: UserWishlistSlice,
        adminVendor: adminVendorSlice,
        adminVenue: adminVenueSlice,
        adminBooking:adminBookingSlice,
        adminPayment:adminPaymentSlice
        
    }
})



