"use client";

import Sidebar from "./sidebar/SideBar";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth/AuthSlice";

export default function SidebarWrapper() {
    const pathname = usePathname();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
        return null;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <Sidebar />;
}
