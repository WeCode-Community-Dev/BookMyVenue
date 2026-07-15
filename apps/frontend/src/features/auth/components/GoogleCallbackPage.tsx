"use client";

import { AppText } from "@/lib/language/LanguageHelper";
import { googleCallbackStyle } from "../styles/GoogleCallbackStyle";
import { useEffect } from "react";

export default function GoogleCallbackPage() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            const search = window.location.search;
            const backendUrl = process.env.NEXT_PUBLIC_API_URL;
            window.location.href = `${backendUrl}/auth/google/callback${search}`;
        }
    }, [
    ]);

    return (
        <div className={googleCallbackStyle.pageWrapper}>
            <div className={googleCallbackStyle.container}>
                <div className={googleCallbackStyle.animationContainer}>
                    {/* Ripple/Pulse effect */}
                    <div className={googleCallbackStyle.pingBg} />
                    <div className={googleCallbackStyle.pulseBg} />
                    {/* Spinner */}
                    <div className={googleCallbackStyle.spinner} />
                </div>
                <h2 className={googleCallbackStyle.title}>
                    <AppText textName="AUTHENTICATING_GOOGLE" textModule="LABEL" />
                </h2>
                <p className={googleCallbackStyle.subtitle}>
                    <AppText textName="OAUTH_VERIFYING_MSG" textModule="MESSAGES" />
                </p>
            </div>
        </div>
    );
}
