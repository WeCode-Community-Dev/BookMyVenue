import { configureStore } from "@reduxjs/toolkit";
import userVenueSlice from './slices/UserVenueSlice'
import UserProfileSlice from "./slices/UserProfileSlice";
import UserWishlistSlice from "./slices/UserWishlistSlice";
import userBookingSlice from "./slices/UserBookingSlice";
import adminUserSlice from './slices/AdminUserSlice';
import adminVendorSlice from './slices/AdminvendorSlice';
import VendorVenueSlice from './slices/VendorVenueSlice';
import VendorDashboardSlice from './slices/VendorDashboardSlice'
import VendorBookingSlice from './slices/VendorBookingSlice'
import VendorProfileSlice from './slices/VendorProfileSlice'
import adminVenueSlice from './slices/AdminVenueSlice'
import adminBookingSlice from './slices/AdminBookingSlice'
import adminPaymentSlice from './slices/AdminPaymentSlice'
import adminDashboardSlice from './slices/AdminDashboardSlice'
import authSlice from './slices/AuthSlice'
import { injectStore } from "@/lib/axios";

export const store = configureStore({
    reducer: {
        auth:authSlice,

        adminUser: adminUserSlice,
        adminVendor: adminVendorSlice,
        adminVenue: adminVenueSlice,
        adminBooking:adminBookingSlice,
        adminPayment:adminPaymentSlice,
        adminDashboard:adminDashboardSlice,


        userVenue: userVenueSlice,
        userProfile: UserProfileSlice,
        userWishlist: UserWishlistSlice,
        userBooking: userBookingSlice,
        
        vendorVenue: VendorVenueSlice,
        vendorDashboard: VendorDashboardSlice,
        vendorBooking: VendorBookingSlice,
        vendorProfile: VendorProfileSlice,
    }
})

injectStore(store)

