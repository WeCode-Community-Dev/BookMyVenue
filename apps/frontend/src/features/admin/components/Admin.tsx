"use client";

import {
    Building2,
    CalendarDays,
    RefreshCw,
    UserCog,
    Users,
} from "lucide-react";
import { adminPendingVenues, adminStats } from "../services/AdminService";

import AdminBottomSection from "@/components/global/admininfo";
import PendingVenueCard from "@/components/global/approvalcard";
import StatsCard from "@/components/global/statcard";
import { adminStyle } from "../styles/AdminStyle";

export default function Admin() {
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

    return (
        <div className={adminStyle.pageWrapper}>
            {/* Page Header */}
            <div>
                <h1 className={adminStyle.headerTitle}>
                    Admin Dashboard
                </h1>

                <p className={adminStyle.headerSubtitle}>
                    Welcome back, Admin! Here&apos;s what&apos;s happening on your platform.
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
                                Pending Venue Approvals
                            </h2>

                            <span className={adminStyle.badge}>
                                {adminPendingVenues.length}
                            </span>
                        </div>

                        <p className={adminStyle.sectionSubtitle}>
                            Venues waiting for your approval
                        </p>
                    </div>

                    <button className={adminStyle.refreshBtn}>
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>

                <div className={adminStyle.approvalsGrid}>
                    {adminPendingVenues.map((venue) => {
                        return (
                            <PendingVenueCard
                                key={venue.id}
                                image={venue.image}
                                name={venue.name}
                                location={venue.location}
                                capacity={venue.capacity}
                                price={venue.price}
                                owner={venue.owner}
                                submittedOn={venue.submittedOn}
                            />
                        );
                    })}
                </div>
            </section>
            <AdminBottomSection />
        </div>
    );
}
