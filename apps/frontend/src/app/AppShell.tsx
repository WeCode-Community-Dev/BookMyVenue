"use client";

import { selectAuthLoading, selectUser } from "@/features/auth/AuthSlice";
import { usePathname, useRouter } from "next/navigation";

import Header from "@/components/global/header/Header";
import PerformanceMonitor from "@/components/global/performancemonitor/PerformanceMonitor";
import SidebarWrapper from "@/components/global/SideBarWrapper";
import { useAuthService } from "@/features/auth/services/AuthService";
import { useDevMode } from "@/store/AppConfigReducer";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function AppShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const devMode = useSelector(useDevMode);
    const user = useSelector(selectUser);
    const authLoading = useSelector(selectAuthLoading);
    const pathname = usePathname();
    const router = useRouter();
    const { fetchProfile } = useAuthService();

    useEffect(() => {
        fetchProfile();
    }, [
    ]);

    useEffect(() => {
        if (authLoading) return;

        if (user?.role === "ADMIN") {
            if (pathname !== "/admin") {
                router.replace("/admin");
            }
        } else if (pathname === "/admin") {
            router.replace("/");
        }
    }, [
        user, authLoading, pathname, router
    ]);

    const isRedirecting =
        (!authLoading && user?.role === "ADMIN" && pathname !== "/admin") ||
        (!authLoading && pathname === "/admin" && user?.role !== "ADMIN");

    return (
        <>
            <Header />
            <div className="flex">
                <SidebarWrapper />
                <main className="flex-1 min-w-0">
                    {isRedirecting ? null : children}
                </main>
            </div>
            {devMode && <PerformanceMonitor />}
        </>
    );
}
