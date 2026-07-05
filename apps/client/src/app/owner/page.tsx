"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Building2, CalendarCheck, CheckCircle2, IndianRupee, Plus } from "lucide-react";
import { ensureOwnerRole } from "./actions";
import StatCards from "@/components/owner/StatCards";
import NavTabs from "@/components/owner/NavTabs";
import OverviewTab from "@/components/owner/OverviewTab";
import BookingsTab from "@/components/owner/BookingsTab";
import VenuesTab from "@/components/owner/VenuesTab";
import VenueModal from "@/components/owner/VenueModal";
import { useOwnerDashboard } from "@/hooks/useDashboard";
import { useRouter, useSearchParams } from "next/navigation";
import { Tab, TABS } from "@/lib/data";

function isTab(value: string | null): value is Tab {
    return value !== null && TABS.includes(value as Tab);
}

export default function OwnerDashboard() {
    const { getToken } = useAuth();
    const { isLoaded, user } = useUser();

    const router = useRouter();
    const searchParams = useSearchParams();

    const tab = searchParams.get("tab");

    const activeTab: Tab = isTab(tab) ? tab : "overview";

    const [showModal, setShowModal] = useState(false);
    const [successToast] = useState(false);

    const { data: dashboardData, isLoading } = useOwnerDashboard();

    const statsData = dashboardData?.stats;
    const venues = dashboardData?.venues ?? [];
    const recentBookings = dashboardData?.recentBookings ?? [];

    const stats = [
        {
            label: "Total Revenue",
            value: `₹${statsData?.totalRevenue ?? 0}`,
            sub: "From confirmed bookings",
            icon: IndianRupee,
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Total Bookings",
            value: statsData?.totalBookings ?? 0,
            sub: `${statsData?.confirmedBookings ?? 0} confirmed`,
            icon: CalendarCheck,
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Active Venues",
            value: statsData?.activeVenues ?? 0,
            sub: `${statsData?.totalVenues ?? 0} total venues`,
            icon: Building2,
            color: "bg-primary/10 text-primary",
        },
    ];

    useEffect(() => {
        if (!isLoaded || !user) return;
        if (user.publicMetadata?.role === "OWNER") return;

        ensureOwnerRole().then(() => getToken({ skipCache: true }));
    }, [isLoaded, user, getToken]);

    const handleTabChange = (tab: Tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-background">
            {successToast && (
                <div className="fixed top-5 right-5 z-100 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium animate-pulse">
                    <CheckCircle2 className="w-4 h-4" />
                    Venue published successfully!
                </div>
            )}

            {showModal && <VenueModal mode="CREATE" onClose={() => setShowModal(false)} />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">BookMyVenue</span>
                        <span className="hidden sm:inline text-xs  ml-1 text-black/50">/ Owner Portal</span>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-accent transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Venue
                    </button>
                </div>

                <StatCards stats={stats} />

                <NavTabs activeTab={activeTab} onTabChange={handleTabChange} />

                {activeTab === "overview" && (
                    <OverviewTab
                        venues={venues}
                        recentBookings={recentBookings}
                        onSetActiveTab={handleTabChange}
                        onShowModal={() => setShowModal(true)}
                        isLoading={isLoading}
                    />
                )}

                {activeTab === "bookings" && <BookingsTab />}
                {activeTab === "venues" && <VenuesTab />}
            </div>
        </div>
    );
}
