import { configureStore } from "@reduxjs/toolkit";
import userVenueSlice from './slices/UserVenueSlice'
import UserProfileSlice from "./slices/UserProfileSlice";

export const store = configureStore({
    reducer: {
        userVenue: userVenueSlice,
        userProfile: UserProfileSlice,
    }
})
