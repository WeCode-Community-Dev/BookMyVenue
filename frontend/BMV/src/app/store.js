import { configureStore } from "@reduxjs/toolkit";
import authReducer, { fetchCurrentUserAsync } from "../modules/auth/authSlice";
import bookingReducer from "../modules/bookings/bookingSlice";
import paymentReducer from "../modules/payments/paymentSlice";
import venueOwnerReducer from "../modules/venueOwner/venueOwnerSlice";
import { isAuthenticated } from "../core/auth/tokenStorage";
import reviewReducer from "../modules/reviews/reviewSlice";
import venuesReducer from "../modules/venues/venuesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    payments: paymentReducer,
    venueOwner: venueOwnerReducer,
    reviews: reviewReducer,
    venues: venuesReducer,
  },
});

if (isAuthenticated()) {
  store.dispatch(fetchCurrentUserAsync());
}

export default store;
