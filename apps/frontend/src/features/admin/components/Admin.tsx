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
import { adminStats } from "../services/AdminService";
import { adminStyle } from "../styles/AdminStyle";
import { useAuthService } from "@/features/auth/services/AuthService";

export default function Admin() {
    const { apiFetch } = useAuthService();
    const [
        pendingVenues, setPendingVenues
    ] = useState<any[]>([
    ]);

    const [
        loading, setLoading
    ] = useState(true);

    const fetchPendingVenues = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiFetch("/venue/pending");
            setPendingVenues(data || [
            ]);
        } catch (err) {
            console.error("Error fetching pending venues:", err);
        } finally {
            setLoading(false);
        }
    }, [
        apiFetch
    ]);

    useEffect(() => {
        fetchPendingVenues();
    }, [
        fetchPendingVenues
    ]);

    const handleApprove = async (id: string) => {
        try {
            await apiFetch(`/venue/approve/${id}`, { method: "POST" });
            fetchPendingVenues();
        } catch (err) {
            console.error("Error approving venue:", err);
            alert(getText("FAILED_APPROVE_VENUE", "MESSAGES"));
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt(getText("ENTER_REJECTION_REASON", "MESSAGES"));
        if (reason === null) return; // User cancelled
        try {
            await apiFetch(`/venue/reject/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rejectionNote: reason }),
            });
            fetchPendingVenues();
        } catch (err) {
            console.error("Error rejecting venue:", err);
            alert(getText("FAILED_REJECT_VENUE", "MESSAGES"));
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

    const stats = adminStats.map((stat) => {
        return {
            ...stat,
            icon: getIcon(stat.icon),
        };
    });

    const formatSubmittedOn = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        } catch (e) {
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

                    <button onClick={fetchPendingVenues} className={adminStyle.refreshBtn}>
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
