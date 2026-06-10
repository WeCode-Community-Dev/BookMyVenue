"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";

export default function SidebarWrapper() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Sidebar />;
}