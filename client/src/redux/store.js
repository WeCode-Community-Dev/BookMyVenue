import { configureStore } from "@reduxjs/toolkit";
import userVenueSlice from './slices/UserVenueSlice'

import UserProfileSlice from "./slices/UserProfileSlice";

import adminUserSlice from './slices/AdminUserSlice'


export const store = configureStore({
    reducer: {
        userVenue: userVenueSlice,

        userProfile: UserProfileSlice,

        adminUser: adminUserSlice

    }
})
