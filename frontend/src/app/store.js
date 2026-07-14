import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../redux/api/baseApi";
import authReducer from '../redux/slices/authSlice'
import adminAuthReducer from '../redux/slices/adminAuthSlice';
import notificationReducer from '../redux/slices/notificationSlice'
import chatReducer from '../redux/slices/chatSlice'
import '../api/conversationApi'

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
        adminAuth: adminAuthReducer,
        notification: notificationReducer,
        chat: chatReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware)
})