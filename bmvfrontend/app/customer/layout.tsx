"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession, UserSession } from "@/src/lib/authStore";
import { CustomerSidebar } from "@/src/customer/components/Sidebar";
import { CustomerTopBar } from "@/src/customer/components/TopBar";
import { Loader2 } from "lucide-react";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    // Redirect if they have the wrong role (e.g. partner or admin tries to go to customer zone)
    if (s.role !== "customer") {
      if (s.role === "venue_owner") {
        router.replace("/partner/dashboard");
      } else if (s.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/login");
      }
      return;
    }
    // Check if customer profile is completed. If not, they MUST onboard.
    if (!s.isProfileCompleted && pathname !== "/customer/profile") {
      router.replace("/customer/profile");
      return;
    }
    setSession(s);
    setChecking(false);
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="h-6 w-6 animate-spin text-[#0D7377] mr-2" />
        <p className="text-sm font-semibold text-[#70706e]">
          Verifying session...
        </p>
      </div>
    );
  }

  // If we are on customer profile and the profile is NOT completed,
  // we render a clean centered layout for onboarding (no sidebar/topbar).
  const isOnboarding = session && !session.isProfileCompleted;

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex font-sans">
      {/* Sidebar — fixed; offsets main content via left margin */}
      <CustomerSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-60 transition-all duration-300">
        <CustomerTopBar
          customerName={session?.name ?? "Customer"}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />

        <main className="flex-grow p-4 md:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
