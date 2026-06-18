"use client";

import Sidebar from "./sidebar/SideBar";
import { usePathname } from "next/navigation";

export default function SidebarWrapper() {
    const pathname = usePathname();

    if (pathname.startsWith("/admin")) {
        return null;
    }

    return <Sidebar />;
}
