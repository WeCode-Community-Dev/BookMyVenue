"use client";

import Header from "@/components/global/header/Header";
import PerformanceMonitor from "@/components/global/performancemonitor/PerformanceMonitor";
import SidebarWrapper from "@/components/global/SideBarWrapper";
import { useDevMode } from "@/store/AppConfigReducer";
import { useSelector } from "react-redux";

export default function AppShell({
    children,
}: {
  children: React.ReactNode;
}) {
    const devMode = useSelector(useDevMode);

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
