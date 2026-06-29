"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession, UserSession } from "@/src/lib/authStore";
import { PartnerSidebar } from "@/src/partner/components/Sidebar";
import { PartnerTopBar } from "@/src/partner/components/TopBar";
import { MyVenue } from "@/src/partner/route";
import { Loader2 } from "lucide-react";

export default function PartnerLayout({
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
    // Exclude auth routes from validation checks to avoid redirect loops
    if (pathname === "/partner/login" || pathname === "/partner/register") {
      setChecking(false);
      return;
    }

    const s = getSession();
    if (!s) {
      router.replace(`/partner/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    if (s.role !== "venue_owner") {
      if (s.role === "customer") {
        router.replace("/customer");
      } else if (s.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/partner/login");
      }
      return;
    }
    setSession(s);

    const checkOnboarding = async () => {
      try {
        const venue = await MyVenue();

        if (!venue || venue.status === "DRAFT") {
          if (pathname !== "/partner/onboarding") {
            router.replace("/partner/onboarding");
          } else {
            setChecking(false);
          }
          return;
        }

        if (
          venue.status === "PENDING_REVIEW" ||
          venue.status === "RESUBMITTED" ||
          venue.status === "CHANGES_REQUESTED" ||
          venue.status === "REJECTED"
        ) {
          if (pathname !== "/partner/status") {
            router.replace("/partner/status");
          } else {
            setChecking(false);
          }
          return;
        }

        // If approved, but visiting onboarding/status page, send to dashboard!
        if (venue.status === "APPROVED") {
          if (pathname === "/partner/onboarding" || pathname === "/partner/status") {
            router.replace("/partner/dashboard");
          } else {
            setChecking(false);
          }
        }
      } catch (err: any) {
        // If venue not found (404), send to onboarding
        if (pathname !== "/partner/onboarding") {
          router.replace("/partner/onboarding");
        } else {
          setChecking(false);
        }
      }
    };

    checkOnboarding();
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="h-6 w-6 animate-spin text-[#0D7377] mr-2" />
        <p className="text-sm font-semibold text-[#70706e]">
          Verifying partner account...
        </p>
      </div>
    );
  }

  // Auth pages (login, register) do not show console layout
  const isAuthPage = pathname === "/partner/login" || pathname === "/partner/register";
  if (isAuthPage) {
    return <div className="min-h-screen bg-[#FAFAF8]">{children}</div>;
  }

  // Onboarding wizard and review status tracking do not show sidebars/topbars
  const isWizardPage = pathname === "/partner/onboarding" || pathname === "/partner/status";
  if (isWizardPage) {
    return <div className="min-h-screen bg-[#FAFAF8]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex font-sans">
      {/* Sidebar */}
      <PartnerSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main workspace */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-60 transition-all duration-300">
        <PartnerTopBar
          partnerName={session?.name ?? "Partner"}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />

        <main className="flex-grow p-4 md:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
