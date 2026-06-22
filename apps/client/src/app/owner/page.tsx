"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Building2, CalendarCheck, CheckCircle2, Clock, IndianRupee, Plus } from "lucide-react";
import { ensureOwnerRole } from "./actions";
import AddVenueModal from "./AddVenueModal";

import { BOOKINGS, VENUES, fmt, type BookingStatus, type Venue } from "./types";
import StatCards from "@/components/owner/StatCards";
import NavTabs from "@/components/owner/NavTabs";
import OverviewTab from "@/components/owner/OverviewTab";
import BookingsTab from "@/components/owner/BookingsTab";
import VenuesTab from "@/components/owner/VenuesTab";

type Tab = "overview" | "bookings" | "venues";

export default function OwnerDashboard() {
    const { getToken } = useAuth();

    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [showModal, setShowModal] = useState(false);
    const [venues, setVenues] = useState<Venue[]>(VENUES);
    const [bookingFilter, setBookingFilter] = useState<BookingStatus | "All">("All");
    const [searchQ, setSearchQ] = useState("");
    const [successToast, setSuccessToast] = useState(false);

    const addVenue = (v: Venue) => {
        setVenues((prev) => [v, ...prev]);
        setSuccessToast(true);
        setTimeout(() => setSuccessToast(false), 3500);
    };

    const filteredBookings = BOOKINGS.filter((b) => {
        const matchStatus = bookingFilter === "All" || b.status === bookingFilter;
        const matchSearch =
            b.client.toLowerCase().includes(searchQ.toLowerCase()) ||
            b.venue.toLowerCase().includes(searchQ.toLowerCase()) ||
            b.id.toLowerCase().includes(searchQ.toLowerCase());
        return matchStatus && matchSearch;
    });

    const totalRevenue = BOOKINGS.filter((b) => b.status === "Confirmed").reduce((s, b) => s + b.amount, 0);
    const confirmed = BOOKINGS.filter((b) => b.status === "Confirmed").length;
    const pending = BOOKINGS.filter((b) => b.status === "Pending").length;

    const stats = [
        {
            label: "Total Revenue",
            value: fmt(totalRevenue),
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
            label: "Pending Requests",
            value: pending,
            sub: "Needs your response",
            icon: Clock,
            color: "bg-amber-50 text-amber-600",
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
        ensureOwnerRole().then(() => getToken({ skipCache: true }));
    }, [getToken]);

    return (
        <div className="min-h-screen bg-background" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {successToast && (
                <div className="fixed top-5 right-5 z-100 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium animate-pulse">
                    <CheckCircle2 className="w-4 h-4" />
                    Venue published successfully!
                </div>
            )}

            {showModal && <AddVenueModal onClose={() => setShowModal(false)} onAdd={addVenue} />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2">
      
                        <span
                            className="text-lg font-bold"
                        >
                            BookMyVenue
                        </span>
                        <span className="hidden sm:inline text-xs  ml-1 text-black/50">
                            / Owner Portal
                        </span>
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

                {activeTab === "bookings" && (
                    <BookingsTab
                        bookingFilter={bookingFilter}
                        searchQ={searchQ}
                        filteredBookings={filteredBookings}
                        onFilterChange={setBookingFilter}
                        onSearchChange={setSearchQ}
                    />
                )}

                {activeTab === "venues" && (
                    <VenuesTab venues={venues} onShowModal={() => setShowModal(true)} />
                )}
            </div>
        </div>
    );
}
