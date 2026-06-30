import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../redux/api/baseApi";
import authReducer from '../redux/slices/authSlice'
import adminAuthReducer from '../redux/slices/adminAuthSlice';
import notificationReducer from '../redux/slices/notificationSlice'

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
        adminAuth: adminAuthReducer,
        notification: notificationReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware)
})