"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Building2, CalendarCheck, CheckCircle2, IndianRupee, Plus } from "lucide-react";
import { ensureOwnerRole } from "./actions";

import { BOOKINGS, VENUES, type Venue } from "./types";
import StatCards from "@/components/owner/StatCards";
import NavTabs from "@/components/owner/NavTabs";
import OverviewTab from "@/components/owner/OverviewTab";
import BookingsTab from "@/components/owner/BookingsTab";
import VenuesTab from "@/components/owner/VenuesTab";
import AddVenueModal from "@/components/owner/VenueModal";
import VenueModal from "@/components/owner/VenueModal";

type Tab = "overview" | "bookings" | "venues";

export default function OwnerDashboard() {
    const { getToken } = useAuth();
    const { isLoaded, user } = useUser();

    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [showModal, setShowModal] = useState(false);
    const [venues] = useState<Venue[]>(VENUES);
    const [successToast] = useState(false);

    const totalRevenue = BOOKINGS.filter((b) => b.status === "Confirmed").reduce((s, b) => s + b.amount, 0);
    const confirmed = BOOKINGS.filter((b) => b.status === "Confirmed").length;
    const pending = BOOKINGS.filter((b) => b.status === "Pending").length;

    const stats = [
        {
            label: "Total Revenue",
            value: "₹" + totalRevenue,
            sub: "+18% this month",
            icon: IndianRupee,
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Total Bookings",
            value: BOOKINGS.length,
            sub: `${confirmed} confirmed`,
            icon: CalendarCheck,
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Active Venues",
            value: venues.filter((v) => v.status === "Active").length,
            sub: `${venues.length} total venues`,
            icon: Building2,
            color: "bg-primary/10 text-primary",
        },
    ];

    useEffect(() => {
        if (!isLoaded || !user) return;
        if (user.publicMetadata?.role === "OWNER") return;

        ensureOwnerRole().then(() => getToken({ skipCache: true }));
    }, [isLoaded, user, getToken]);

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

                <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === "overview" && (
                    <OverviewTab
                        venues={venues}
                        pending={pending}
                        onSetActiveTab={setActiveTab}
                        onShowModal={() => setShowModal(true)}
                    />
                )}

                {activeTab === "bookings" && <BookingsTab />}
                {activeTab === "venues" && <VenuesTab />}
            </div>
        </div>
    );
}
