"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import BecomeOwnerCard from "@/components/profile/BecomeOwnerCard";
import ProfileForm from "@/components/profile/ProfileForm";
import BookingsTab from "@/components/profile/BookingsTab";
import WishlistTab from "@/components/profile/WishlistTab";
import NotificationsTab from "@/components/profile/NotificationsTab";
import BecomeOwnerTab from "@/components/profile/BecomeOwnerTab";
import MyVenuesTab from "@/components/profile/MyVenuesTab";
import ListingRequestsTab from "@/components/profile/ListingRequestsTab";
import DeveloperLogin from "@/components/auth/DeveloperLogin";
import { ShieldAlert, LogIn } from "lucide-react";

function ProfilePageContent() {
  const { isLoggedIn, user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const activeTab = searchParams.get("tab") || "profile";

  const handleTabChange = (tabName: string) => {
    router.push(`/profile?tab=${tabName}`);
  };

  if (!isLoggedIn) {
    return (
      <>
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="flex-grow flex items-center justify-center py-20 px-4 bg-slate-50">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 max-w-md text-center shadow-xl space-y-6 animate-in scale-in-95 duration-200">
            <div className="mx-auto size-12 rounded-full bg-rose-50 flex items-center justify-center">
              <ShieldAlert className="size-6 text-rose-600" />
            </div>
            <div className="space-y-2 select-none">
              <h2 className="text-xl font-extrabold text-slate-900">Authentication Required</h2>
              <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                You must be logged in to view your profile settings, booking histories, and host shortcuts.
              </p>
            </div>
            <div className="pt-2 select-none">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 h-11 w-full rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-extrabold shadow-md active:translate-y-px transition-all"
              >
                <LogIn className="size-4" />
                <span>Go to Login</span>
              </Link>
            </div>
          </div>
        </main>
        
        {/* Developer login switch overlay helper at bottom */}
        <div className="w-full flex justify-center py-6 bg-slate-100 select-none">
          <DeveloperLogin />
        </div>
        
        <Footer />
      </>
    );
  }

  // Determine what to render in main right column based on active tab parameter
  const renderTabContent = () => {
    switch (activeTab) {
      case "bookings":
        return <BookingsTab />;
      case "wishlist":
        return <WishlistTab />;
      case "notifications":
        return <NotificationsTab />;
      case "become-owner":
        return <BecomeOwnerTab onSuccessRedirect={handleTabChange} />;
      case "my-venues":
        return <MyVenuesTab />;
      case "listing-requests":
        return <ListingRequestsTab />;
      case "settings":
        return (
          <div className="bg-white border border-slate-200/60 shadow-xs rounded-3xl p-6 sm:p-8 space-y-6 text-left select-none">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Account Settings</h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              Manage your password, login authorization credentials, safety limits, and payout bank accounts (mock details).
            </p>
            <div className="border border-slate-100 rounded-xl p-5 space-y-4 max-w-sm">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Status Notifications</span>
                <p className="text-xs text-slate-650 font-extrabold">Email alerts enabled</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Hosting Payout Bank</span>
                <p className="text-xs text-slate-650 font-extrabold">HDFC Bank Account ending in ****2319</p>
              </div>
            </div>
          </div>
        );
      case "profile":
      default:
        return (
          <div className="space-y-6 sm:space-y-8">
            <ProfileHeader
              name={user.name}
              email={user.email}
              memberSince={user.memberSince}
              role={user.role}
            />
            {user.role === "User" && <BecomeOwnerCard role={user.role} />}
            <ProfileStats stats={user.stats} />
            <ProfileForm />
          </div>
        );
    }
  };

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-grow bg-slate-50/50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
            {/* Left Sidebar (3/10 columns) */}
            <div className="lg:col-span-3 lg:sticky lg:top-24">
              <ProfileSidebar
                avatar={user.avatar}
                name={user.name}
                role={user.role}
                memberSince={user.memberSince}
              />
            </div>

            {/* Right Main Content (7/10 columns) */}
            <div className="lg:col-span-7">
              {renderTabContent()}
            </div>
          </div>

          {/* Centered Developer Helper Tool at bottom */}
          <div className="border-t border-slate-200/50 pt-10 flex flex-col items-center select-none">
            <p className="text-xs font-semibold text-slate-400 mb-2">
              Verify page rendering under different role views:
            </p>
            <DeveloperLogin />
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center py-40 select-none text-slate-400 font-extrabold">
        Loading Profile Dashboard...
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
