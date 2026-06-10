import ProfileHeroCard from "@/components/global/profilecard";
import ProfileActionCard from "@/components/global/actioncard";
import StatsCard from "@/components/global/statcard";
import MyVenuesCard from "@/components/global/publishedvenues";
import BusinessInformationCard from "@/components/global/businessinfo";
import RevenueSummaryCard from "@/components/global/revenuesummary";
import {
  User,
  Lock,
  Settings,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import SavedVenueCard from "@/components/global/microcard";
import VenueStatisticsCard from "@/components/global/venuestats";

const venues = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    name: "Lagoona Beach Resort",
    location: "Cherai, Kochi",
    status: "Active" as const,
  },

  {
    id: 2,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865",
    name: "Silverline Banquets",
    location: "Edappally, Kochi",
    status: "Active" as const,
  },

  {
    id: 3,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865",
    name: "The Garden Courtyard",
    location: "Kakkanad, Kochi",
    status: "Pending" as const,
  },
];

const savedVenues = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    name: "Lagoona Beach Resort",
    location: "Cherai, Kochi",
    price: 18000,
  },

  {
    id: 2,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    name: "Silverline Banquets",
    location: "Edappally, Kochi",
    price: 15000,
  },

  {
    id: 3,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865",
    name: "The Garden Courtyard",
    location: "Kakkanad, Kochi",
    price: 8000,
  },

  {
    id: 4,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    name: "Palm Grove Residency",
    location: "Kalamasery, Kochi",
    price: 22000,
  },
];

export default function Page() {
  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">
      <ProfileHeroCard />

      {/* Action Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
          icon={<Lock className="h-7 w-7" />}
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
      <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Booking Statistics
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Overview of your booking activity
            </p>
          </div>

          <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
            View All Bookings →
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
      <section className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Saved Venues
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Venues you have saved as favourites
            </p>
          </div>

          <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
            View All Saved →
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {savedVenues.map((venue) => (
            <SavedVenueCard
              key={venue.id}
              image={venue.image}
              name={venue.name}
              location={venue.location}
              price={venue.price}
            />
          ))}
        </div>
      </section>
      <div className="relative my-8 flex items-center justify-center">
        {/* Line */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent" />

        {/* Badge */}
        <div className="relative z-10 rounded-full bg-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-sm">
          Visible to Owners Only
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MyVenuesCard venues={venues} />

        {/* BusinessInformationCard */}
        <BusinessInformationCard />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RevenueSummaryCard />
         <VenueStatisticsCard/>
         
        {/* Revenue Statistics Card */}
      </div>
    </div>
  );
}

// import React from 'react'

// const page = () => {
//   return (
//     <div>
//       User profile details and settings will be displayed here.
//       5. Profile Route (/profile)
// Must Have

// ✅ Edit Profile

// ✅ Change Password

// ✅ Settings

// ✅ Language settings(optional)

// Impressive

// ⭐ Booking Statistics

// Total Bookings
// Completed
// Cancelled

// ⭐ Saved Venues

// (Favorites)
//     </div>
//   )
// }

// export default page
