import { LOCAL_STORAGE, THEME } from "@/lib/Constants";

import { createSlice } from "@reduxjs/toolkit";

interface AppConfigProps {
  theme: string;
}

const initialState: AppConfigProps = {
    theme: typeof window !== "undefined" ? (localStorage.getItem(LOCAL_STORAGE.APP_THEME) || THEME.LIGHT) : THEME.LIGHT,
};

const AppConfigSlice = createSlice({
    name: "AppConfigReducer",
    initialState,
    reducers: {
        storeTheme: (state, action) => {
            if (typeof window !== "undefined") {
                localStorage.setItem(LOCAL_STORAGE.APP_THEME, action.payload);
            }
            return Object.assign({}, state, { theme: action.payload });
        },
    },
});

export const { storeTheme } = AppConfigSlice.actions;

export const useConfigTheme = (state: { AppConfigReducer: AppConfigProps }) => {
    return state.AppConfigReducer.theme;
};

export default AppConfigSlice.reducer;
