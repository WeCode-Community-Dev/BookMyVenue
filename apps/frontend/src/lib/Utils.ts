import { ClassValue } from "class-variance-authority/types";
import clsx from "clsx";
import { languageOptions } from "./language/LanguageHelper";
import store from "@/store/Store";
import { storeLanguage } from "@/store/AppConfigReducer";
import { twMerge } from "tailwind-merge";

export const isEmpty = (variable: any) => {
    const type = typeof variable;
    if (variable === null) return true;
    if (type === "undefined") return true;
    if (type === "boolean") return false;
    if (type === "string") return !variable.trim();
    if (type === "number") return false;
    if (Array.isArray(variable)) return !variable.length;
    if (type === "object") return !Object.keys(variable).length;
    return !variable;
};

export const isNonEmpty = (variable: any) => {
    return !isEmpty(variable);
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const updateAppLanguage = (lang: string) => {
    store.dispatch(storeLanguage(lang));
};

export const setLanguage = (lang: string) => {
    if (lang && languageOptions.includes(lang.toLowerCase()))
        updateAppLanguage(lang.toLowerCase());
};
