import { LOCAL_STORAGE, THEME } from "@/lib/Constants";

import { DEFAULT_LANGUAGE } from "@/lib/language/LanguageHelper";
import { createSlice } from "@reduxjs/toolkit";

interface AppConfigProps {
  theme: string;
  language: string;
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
        }
    },
});

export const { storeTheme, storeLanguage } = AppConfigSlice.actions;

export const useConfigTheme = (state: { AppConfigReducer: AppConfigProps }) => {
    return state.AppConfigReducer.theme;
};

export const useLanguage = (state: { AppConfigReducer: AppConfigProps }) => {
    return state.AppConfigReducer.language;
};

export default AppConfigSlice.reducer;
