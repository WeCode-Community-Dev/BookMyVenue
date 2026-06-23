import { LOCAL_STORAGE, THEME } from "@/lib/Constants";

import { DEFAULT_LANGUAGE } from "@/lib/language/LanguageHelper";
import { createSlice } from "@reduxjs/toolkit";

interface AppConfigProps {
  theme: string;
  language: string;
  devMode: boolean;
}

const initialState: AppConfigProps = {
    theme:
    typeof window !== "undefined"
        ? localStorage.getItem(LOCAL_STORAGE.APP_THEME) || THEME.LIGHT
        : THEME.LIGHT,
    language:
    typeof window !== "undefined"
        ? localStorage.getItem(LOCAL_STORAGE.APP_LANG) || DEFAULT_LANGUAGE
        : DEFAULT_LANGUAGE,
    devMode:typeof window !== "undefined"? localStorage.getItem(LOCAL_STORAGE.DEV_MODE) === "true" :false
};

const AppConfigSlice = createSlice({
    name: "AppConfigReducer",
    initialState,
    reducers: {
        storeTheme: (state, action) => {
            localStorage.setItem(LOCAL_STORAGE.APP_THEME, action.payload);
            return Object.assign({}, state, { theme: action.payload });
        },
        storeLanguage: (state, action) => {
            localStorage.setItem(LOCAL_STORAGE.APP_LANG, action.payload);
            return Object.assign({}, state, { language: action.payload });
        },
        enableDevMode: (state) => {
            localStorage.setItem(LOCAL_STORAGE.DEV_MODE, "true");
            state.devMode = true;
        },
        disableDevMode: (state) => {
            localStorage.setItem(LOCAL_STORAGE.DEV_MODE, "false");
            state.devMode = false;
        },
    },
});

export const { storeTheme, storeLanguage, enableDevMode, disableDevMode } =
  AppConfigSlice.actions;

export const useConfigTheme = (state: { AppConfigReducer: AppConfigProps }) => {
    return state.AppConfigReducer.theme;
};

export const useLanguage = (state: { AppConfigReducer: AppConfigProps }) => {
    return state.AppConfigReducer.language;
};

export const useDevMode = (state: { AppConfigReducer: AppConfigProps }) => {
    return state.AppConfigReducer.devMode;
};

export default AppConfigSlice.reducer;
