"use client";

import { Building2, CalendarDays, Clock3, IndianRupee } from "lucide-react";

import AddVenueCard from "@/components/global/addvenue";
import ProTipCard from "@/components/global/tipcard";
import RecentBookings from "@/components/global/table";
import StatsCard from "@/components/global/statcard";
import TodayAtGlanceCard from "@/components/global/daystats";
import VenueCard from "@/components/global/minicard";
import dummyData from "../../../../DummyData.json";
import { ownerStyle } from "../styles/OwnerStyle";

export default function Owner() {
    const venues = dummyData.venues;

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
                    Welcome back, Vishnu! 👋
                </h1>

                <p className={ownerStyle.welcomeSubtitle}>
                    Here&apos;s what&apos;s happening with your venues today.
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
                            My Venues
                        </h2>

                        <button className={ownerStyle.viewAllButton}>
                            View All Venues →
                        </button>
                    </div>

                    {/* Venue Cards */}
                    <div className={ownerStyle.venueCardsGrid}>
                        {venues.map((venue) => {
                            return (
                                <VenueCard
                                    key={venue.id}
                                    image={venue.image}
                                    name={venue.name}
                                    location={venue.location}
                                    guests={venue.guests}
                                    price={venue.price}
                                    status={venue.status}
                                />
                            );
                        })}
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

// Owner Dashboard
// /owner/dashboard
// Must Have

// ✅ Add Venue

// ✅ Edit Venue

// ✅ Manage Bookings

// Impressive

// ⭐ Analytics Dashboard

// Cards:

// Total Venues
// Total Bookings
// Monthly Revenue
// Occupancy Rate

// ⭐ Revenue Charts

// ⭐ Booking Trends

// Even simple charts look very professional.
//     </div>
//   )
// }

// export default page
