import { configureStore } from "@reduxjs/toolkit";
import userVenueSlice from './slices/UserVenueSlice'
import userProfileReducer from "./slices/UserProfileSlice";

export const store = configureStore({
    reducer: {
        userVenue: userVenueSlice,
        userProfile: userProfileReducer,
    }
})
