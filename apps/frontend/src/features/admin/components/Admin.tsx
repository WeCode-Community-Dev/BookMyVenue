"use client";

import { AppText, getText } from "@/lib/language/LanguageHelper";
import {
    Building2,
    CalendarDays,
    RefreshCw,
    UserCog,
    Users,
} from "lucide-react";
import {
    getVenueCapacity,
    getVenueLocation,
    getVenuePrice,
    getVenuePrimaryImage,
} from "@/features/venues/services/VenuService";
import { useCallback, useEffect, useState } from "react";

import AdminBottomSection from "@/components/global/AdminInfo";
import PendingVenueCard from "@/components/global/ApprovalCard";
import StatsCard from "@/components/global/StatCard";
import { adminStyle } from "../styles/AdminStyle";
import { useAuthService } from "@/features/auth/services/AuthService";

export default function Admin() {
    const { apiFetch } = useAuthService();
    const [
        counts, setCounts
    ] = useState({
        totalUsers: 0,
        totalOwners: 0,
        totalVenues: 0,
        totalBookings: 0,
    });

    const [
        pendingVenues, setPendingVenues
    ] = useState<any[]>([
    ]);

    const [
        loading, setLoading
    ] = useState(true);

    const fetchDashboardStats = useCallback(async () => {
        try {
            const resData = await apiFetch("/admin/dashboard");
            if (resData) {
                setCounts({
                    totalUsers: resData.totalUsers ?? 0,
                    totalOwners: resData.totalOwners ?? 0,
                    totalVenues: resData.totalVenues ?? 0,
                    totalBookings: resData.totalBookings ?? 0,
                });
            }
        } catch (resErr) {
            console.error("Error fetching dashboard stats:", resErr);
        }
    }, [
        apiFetch
    ]);

    const fetchPendingVenues = useCallback(async () => {
        setLoading(true);
        try {
            const resData = await apiFetch("/admin/venues/pending");
            setPendingVenues(resData || [
            ]);
        } catch (resErr) {
            console.error("Error fetching pending venues:", resErr);
        } finally {
            setLoading(false);
        }
    }, [
        apiFetch
    ]);

    const loadAdminData = useCallback(async () => {
        await Promise.all([
            fetchDashboardStats(), fetchPendingVenues()
        ]);
    }, [
        fetchDashboardStats, fetchPendingVenues
    ]);

    useEffect(() => {
        loadAdminData();
    }, [
        loadAdminData
    ]);

    const handleApprove = async (id: string) => {
        try {
            await apiFetch(`/admin/venues/${id}/approve`, { method: "PATCH" });
            loadAdminData();
        } catch (resErr) {
            console.error("Error approving venue:", resErr);
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt(getText("ENTER_REJECTION_REASON", "MESSAGES"));
        if (reason === null) return; // User cancelled
        try {
            await apiFetch(`/admin/venues/${id}/reject`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rejectionNote: reason }),
            });
            loadAdminData();
        } catch (resErr) {
            console.error("Error rejecting venue:", resErr);
        }
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "Users":
                return <Users className="h-8 w-8 text-teal-600" />;
            case "UserCog":
                return <UserCog className="h-8 w-8 text-orange-600" />;
            case "Building2":
                return <Building2 className="h-8 w-8 text-violet-600" />;
            case "CalendarDays":
                return <CalendarDays className="h-8 w-8 text-green-600" />;
            default:
                return null;
        }
    };

    const stats = [
        {
            title: "Total Users",
            value: counts.totalUsers,
            subText: "All registered users",
            icon: getIcon("Users"),
            color: "text-teal-600",
        },
        {
            title: "Total Owners",
            value: counts.totalOwners,
            subText: "Venue owners",
            icon: getIcon("UserCog"),
            color: "text-orange-600",
        },
        {
            title: "Total Venues",
            value: counts.totalVenues,
            subText: "Listed venues",
            icon: getIcon("Building2"),
            color: "text-violet-600",
        },
        {
            title: "Total Bookings",
            value: counts.totalBookings,
            subText: "All bookings",
            icon: getIcon("CalendarDays"),
            color: "text-green-600",
        },
    ];

    const formatSubmittedOn = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString;
        }
    };

    return (
        <div className={adminStyle.pageWrapper}>
            {/* Page Header */}
            <div>
                <h1 className={adminStyle.headerTitle}>
                    <AppText textName="ADMIN_DASHBOARD" textModule="LABEL" />
                </h1>

                <p className={adminStyle.headerSubtitle}>
                    <AppText textName="ADMIN_SUBTITLE" textModule="LABEL" />
                </p>
            </div>

            {/* Statistics */}
            <section>
                <div className={adminStyle.statsGrid}>
                    {stats.map((stat) => {
                        return (
                            <StatsCard
                                key={stat.title}
                                title={stat.title}
                                value={stat.value}
                                subText={stat.subText}
                                icon={stat.icon}
                                subTextColor={stat.color}
                            />
                        );
                    })}
                </div>
            </section>

            {/* Pending Venue Approvals */}
            <section className={adminStyle.approvalsSection}>
                <div className={adminStyle.sectionHeader}>
                    <div>
                        <div className={adminStyle.sectionHeaderTitleWrapper}>
                            <h2 className={adminStyle.sectionTitle}>
                                <AppText textName="PENDING_VENUE_APPROVALS" textModule="LABEL" />
                            </h2>

                            <span className={adminStyle.badge}>
                                {pendingVenues.length}
                            </span>
                        </div>

                        <p className={adminStyle.sectionSubtitle}>
                            <AppText textName="VENUES_WAITING_APPROVAL" textModule="LABEL" />
                        </p>
                    </div>

                    <button onClick={loadAdminData} className={adminStyle.refreshBtn}>
                        <RefreshCw className="h-4 w-4" />
                        <AppText textName="REFRESH" textModule="BUTTON" />
                    </button>
                </div>

                <div className={adminStyle.approvalsGrid}>
                    {loading
                        ? (
                            <div className={adminStyle.emptyState}>
                                <AppText textName="LOADING_PENDING_VENUES" textModule="LABEL" />
                            </div>
                        )
                        : pendingVenues.length === 0
                            ? (
                                <div className={adminStyle.emptyState}>
                                    <AppText textName="NO_PENDING_APPROVALS" textModule="LABEL" />
                                </div>
                            )
                            : (
                                pendingVenues.map((venue) => {
                                    return (
                                        <PendingVenueCard
                                            key={venue.id}
                                            id={venue.id}
                                            imageUrl={getVenuePrimaryImage(venue)}
                                            venueName={venue.name}
                                            venueLocation={getVenueLocation(venue)}
                                            capacity={getVenueCapacity(venue)}
                                            price={getVenuePrice(venue)}
                                            owner={venue.owner?.name || "Unknown"}
                                            submittedOn={formatSubmittedOn(venue.createdAt)}
                                            onApprove={handleApprove}
                                            onReject={handleReject}
                                        />
                                    );
                                })
                            )}
                </div>
            </section>
            <AdminBottomSection />
        </div>
    );
}
