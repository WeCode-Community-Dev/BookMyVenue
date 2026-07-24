"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "@/store/Store";
import ThemeBase from "@/styles/ThemBase";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeBase />
            {children}
        </Provider>
    );
}
