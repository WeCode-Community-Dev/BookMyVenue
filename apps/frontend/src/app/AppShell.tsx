"use client";

import { useEffect } from "react";
import Header from "@/components/global/header/Header";
import PerformanceMonitor from "@/components/global/performancemonitor/PerformanceMonitor";
import SidebarWrapper from "@/components/global/SideBarWrapper";
import { useDevMode } from "@/store/AppConfigReducer";
import { useSelector } from "react-redux";
import { useAuthService } from "@/features/auth/services/AuthService";

export default function AppShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const devMode = useSelector(useDevMode);
    const { fetchProfile } = useAuthService();

    useEffect(() => {
        fetchProfile();
    }, [
    ]);

    return (
        <>
            <Header />
            <div className="flex">
                <SidebarWrapper />
                <main className="flex-1">
                    {children}
                </main>
            </div>
            {devMode && <PerformanceMonitor />}
        </>
    );
}
