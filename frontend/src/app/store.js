import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../redux/api/baseApi";
import authReducer from '../redux/slices/authSlice'

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware)
})