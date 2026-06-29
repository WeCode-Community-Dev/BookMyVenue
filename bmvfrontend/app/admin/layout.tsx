"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, UserSession } from "@/src/lib/authStore";
import { AdminSidebar } from "@/src/admin/components/Sidebar";
import { TopBar } from "@/src/admin/components/TopBar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "admin") {
      router.replace("/login?returnUrl=/admin/dashboard");
      return;
    }
    setSession(s);
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="h-6 w-6 animate-spin text-[#0D7377] mr-2" />
        <p className="text-sm font-semibold text-[#70706e]">
          Verifying access...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex font-sans">
      {/* Sidebar — fixed; offsets main content via left margin */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/*
        Main content column.
        On desktop we offset to the right of the sidebar.
        The sidebar itself uses CSS transition on width so we can't
        easily sync the exact offset here — we rely on a generous
        lg:ml-60 that matches the expanded default.
      */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-60 transition-all duration-300">
        <TopBar
          adminName={session?.name ?? "Admin"}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
