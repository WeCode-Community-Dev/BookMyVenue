import { type Action, combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../features/auth/authSlice";

import AppConfigReducer from "./AppConfigReducer";

const combinedReducer = combineReducers({
    AppConfigReducer,
    AuthReducer,
});

const rootReducer = (state: any, action: Action) => {
    if (action.type === "AppConfigReducer/resetApp") {
        state = {};
    }
    return combinedReducer(state, action);
};

const store = configureStore({
    devTools:false,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
});

export default store;
