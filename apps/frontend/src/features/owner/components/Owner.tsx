"use client";

import { Building2, CalendarDays, Clock3, IndianRupee } from "lucide-react";
import {
    getVenueCapacity,
    getVenueLocation,
    getVenuePrice,
    getVenuePrimaryImage,
} from "@/features/venues/services/VenuService";
import { useEffect, useState } from "react";

import AddVenueCard from "@/components/global/AddVenueCard";
import { AppText } from "@/lib/language/LanguageHelper";
import ProTipCard from "@/components/global/TipCard";
import RecentBookings from "@/components/global/Table";
import StatsCard from "@/components/global/StatCard";
import TodayAtGlanceCard from "@/components/global/DayStats";
import VenueCard from "@/components/global/MiniCard";
import dummyData from "../../../../DummyData.json";
import { ownerStyle } from "../styles/OwnerStyle";
import { useAuthService } from "@/features/auth/services/AuthService";

export default function Owner() {
    const { apiFetch, user } = useAuthService();
    const [
        venues, setVenues
    ] = useState<any[]>([
    ]);

    const [
        loading, setLoading
    ] = useState(true);

    useEffect(() => {
        const fetchOwnerVenues = async () => {
            try {
                const resData = await apiFetch("/venue/my-venues");
                setVenues(resData || [
                ]);
            } catch (resErr) {
                console.error("Error fetching my venues:", resErr);
            } finally {
                setLoading(false);
            }
        };
        fetchOwnerVenues();
    }, [
        apiFetch
    ]);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "Building2":
                return <Building2 className="h-8 w-8 text-teal-600" />;
            case "CalendarDays":
                return <CalendarDays className="h-8 w-8 text-blue-600" />;
            case "Clock3":
                return <Clock3 className="h-8 w-8 text-orange-600" />;
            case "IndianRupee":
                return <IndianRupee className="h-8 w-8 text-green-600" />;
            default:
                return null;
        }
    };

    const stats = dummyData.stats.map((stat) => {
        return {
            ...stat,
            icon: getIcon(stat.icon),
        };
    });

    return (
        <div className={ownerStyle.pageWrapper}>
            {/* Welcome Section */}
            <div className={ownerStyle.welcomeSection}>
                <h1 className={ownerStyle.welcomeHeading}>
                    <AppText textName="WELCOME_BACK_EMOJI" textModule="LABEL" />
                    {user?.name ? `, ${user.name}` : ""}!
                </h1>

                <p className={ownerStyle.welcomeSubtitle}>
                    <AppText textName="OWNER_HAPPENING_TODAY" textModule="LABEL" />
                </p>
            </div>

            {/* Stats Cards */}
            <div className={ownerStyle.statsGrid}>
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

            {/* Main Layout */}
            <div className={ownerStyle.mainLayout}>
                {/* LEFT SECTION */}
                <section className={ownerStyle.leftSection}>
                    <div className={ownerStyle.sectionHeaderWrapper}>
                        <h2 className={ownerStyle.sectionTitle}>
                            <AppText textName="MY_VENUE" textModule="MENUS" />
                        </h2>

                        <button className={ownerStyle.viewAllButton}>
                            <AppText textName="VIEW_ALL_VENUES" textModule="LABEL" />
                        </button>
                    </div>

                    {/* Venue Cards */}
                    <div className={ownerStyle.venueCardsGrid}>
                        {loading
                            ? (
                                <div className={ownerStyle.emptyState}>
                                    <AppText textName="LOADING_VENUES" textModule="MESSAGES" />
                                </div>
                            )
                            : venues.length === 0
                                ? (
                                    <div className={ownerStyle.emptyState}>
                                        <AppText textName="NO_VENUES_FOUND" textModule="MESSAGES" />
                                    </div>
                                )
                                : (
                                    venues.map((venue) => {
                                        return (
                                            <VenueCard
                                                key={venue.id}
                                                imageUrl={getVenuePrimaryImage(venue)}
                                                venueName={venue.name}
                                                venueLocation={getVenueLocation(venue)}
                                                guests={getVenueCapacity(venue)}
                                                price={getVenuePrice(venue)}
                                                venueStatus={venue.status}
                                            />
                                        );
                                    })
                                )}
                    </div>

                    {/* Recent Bookings */}
                    <div className={ownerStyle.recentBookingsWrapper}>
                        <RecentBookings />
                    </div>
                </section>

                {/* RIGHT SIDEBAR */}
                <aside className={ownerStyle.rightSidebar}>
                    <AddVenueCard />
                    <TodayAtGlanceCard />
                    <ProTipCard />
                </aside>
            </div>
        </div>
    );
}
