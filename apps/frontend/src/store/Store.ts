import { type Action, combineReducers, configureStore } from "@reduxjs/toolkit";

import AppConfigReducer from "./AppConfigReducer";

const combinedReducer = combineReducers({
    AppConfigReducer,
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
