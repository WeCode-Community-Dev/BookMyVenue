"use client";

import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Lock as LockIcon,
    Settings,
    User,
    XCircle,
} from "lucide-react";

import BusinessInformationCard from "@/components/global/BusinessInfo";
import MyVenuesCard from "@/components/global/PublishedVenues";
import ProfileActionCard from "@/components/global/ActionCard";
import ProfileHeroCard from "@/components/global/ProfileCard";
import RevenueSummaryCard from "@/components/global/RevenueSummary";
import SavedVenueCard from "@/components/global/MicroCard";
import StatsCard from "@/components/global/StatCard";
import VenueStatisticsCard from "@/components/global/VenueStats";
import dummyData from "../../../../DummyData.json";
import { profileStyle } from "../styles/ProfileStyle";

export default function Profile() {
    const myVenues = dummyData.myVenues as any[];
    const savedVenues = dummyData.savedVenues;
    return (
        <div className={profileStyle.profileWrapper}>
            <ProfileHeroCard />

            {/* Action Cards */}
            <div className={profileStyle.actionCardsGrid}>
                <ProfileActionCard
                    title="Edit Profile"
                    description="Update your personal information and contact details."
                    buttonText="Edit Now"
                    icon={<User className="h-7 w-7" />}
                />
                <ProfileActionCard
                    title="Change Password"
                    description="Keep your account secure and updated."
                    buttonText="Change Password"
                    icon={<LockIcon className="h-7 w-7" />}
                    iconBgColor="bg-indigo-50"
                    iconColor="text-indigo-600"
                />
                <ProfileActionCard
                    title="Settings"
                    description="Manage your preferences, notifications and more."
                    buttonText="Open Settings"
                    icon={<Settings className="h-7 w-7" />}
                    iconBgColor="bg-green-50"
                    iconColor="text-green-600"
                />
            </div>
            {/* Booking Statistics */}
            <section className={profileStyle.sectionWrapper}>
                <div className={profileStyle.sectionHeader}>
                    <div>
                        <h2 className={profileStyle.sectionTitle}>
                            Booking Statistics
                        </h2>

                        <p className={profileStyle.sectionSubtitle}>
                            Overview of your booking activity
                        </p>
                    </div>

                    <button className={profileStyle.sectionLinkBtn}>
                        View All Bookings →
                    </button>
                </div>

                <div className={profileStyle.statsGrid}>
                    <StatsCard
                        title="Total Bookings"
                        value={32}
                        subText="All time"
                        subTextColor="text-slate-500"
                        icon={<CalendarDays className="h-8 w-8 text-teal-600" />}
                    />
                    <StatsCard
                        title="Completed"
                        value={20}
                        subText="62.5% of total"
                        subTextColor="text-green-600"
                        icon={<CheckCircle2 className="h-8 w-8 text-green-600" />}
                    />
                    <StatsCard
                        title="Upcoming"
                        value={8}
                        subText="Next 30 days"
                        subTextColor="text-blue-600"
                        icon={<Clock3 className="h-8 w-8 text-blue-600" />}
                    />
                    <StatsCard
                        title="Cancelled"
                        value={4}
                        subText="12.5% of total"
                        subTextColor="text-red-600"
                        icon={<XCircle className="h-8 w-8 text-red-600" />}
                    />
                </div>
            </section>
            {/* Saved Venues */}
            <section className={profileStyle.sectionWrapper}>
                <div className={profileStyle.sectionHeader}>
                    <div>
                        <h2 className={profileStyle.sectionTitle}>
                            Saved Venues
                        </h2>
                        <p className={profileStyle.sectionSubtitle}>
                            Venues you have saved as favourites
                        </p>
                    </div>
                    <button className={profileStyle.sectionLinkBtn}>
                        View All Saved →
                    </button>
                </div>
                <div className={profileStyle.savedVenuesGrid}>
                    {savedVenues.map((venue) => {
                        return (
                            <SavedVenueCard
                                key={venue.id}
                                image={venue.image}
                                name={venue.name}
                                location={venue.location}
                                price={venue.price}
                            />
                        );
                    })}
                </div>
            </section>
            <div className={profileStyle.dividerWrapper}>
                {/* Line */}
                <div className={profileStyle.dividerLine} />

                {/* Badge */}
                <div className={profileStyle.dividerBadge}>
                    Visible to Owners Only
                </div>
            </div>

            <div className={profileStyle.mainColumnsGrid}>
                <MyVenuesCard venues={myVenues} />
                {/* BusinessInformationCard */}
                <BusinessInformationCard />
            </div>

            <div className={profileStyle.statsColumnsGrid}>
                <RevenueSummaryCard />
                <VenueStatisticsCard />
                {/* Revenue Statistics Card */}
            </div>
        </div>
    );
}
