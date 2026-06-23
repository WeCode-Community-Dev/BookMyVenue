
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../modules/auth/authSlice'
import bookingReducer from '../modules/bookings/bookingSlice'
import paymentReducer from '../modules/payments/paymentSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    payments: paymentReducer,
  },
});

export default store;
