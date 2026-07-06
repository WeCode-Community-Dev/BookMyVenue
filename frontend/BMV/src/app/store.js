
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../modules/auth/authSlice'
import bookingReducer from '../modules/bookings/bookingSlice'
import paymentReducer from '../modules/payments/paymentSlice'
import venueOwnerReducer from "../modules/venueOwner/venueOwnerSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    payments: paymentReducer,
    venueOwner: venueOwnerReducer,
  },
});

export default store;
