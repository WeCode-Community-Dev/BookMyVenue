import { configureStore } from "@reduxjs/toolkit";

import userVenueSlice from "./slices/UserVenueSlice";
import UserProfileSlice from "./slices/UserProfileSlice";
import adminUserSlice from "./slices/AdminUserSlice";
import UserWishlistSlice from "./slices/UserWishlistSlice";

export const store = configureStore({
  reducer: {
    userVenue: userVenueSlice,

    userProfile: UserProfileSlice,

    userWishlist: UserWishlistSlice,

    adminUser: adminUserSlice,
  },
});
