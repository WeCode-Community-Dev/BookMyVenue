"use client";

import StatsCard from "@/components/global/statcard";
import VenueCard from "@/components/global/minicard";
import AddVenueCard from "@/components/global/addvenue";
import { Building2, CalendarDays, Clock3, IndianRupee } from "lucide-react";
import RecentBookings from "@/components/global/table";
import TodayAtGlanceCard from "@/components/global/daystats";
import ProTipCard from "@/components/global/tipcard";
type Venue = {
  id: number;
  image: string;
  name: string;
  location: string;
  guests: number;
  price: number;
  status: "Active" | "Inactive";
};

export default function Page() {
  const venues: Venue[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      name: "Lagoona Beach Resort",
      location: "Cherai, Kochi",
      guests: 200,
      price: 18000,
      status: "Active",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
      name: "The Garden Courtyard",
      location: "Kakkanad, Kochi",
      guests: 100,
      price: 8000,
      status: "Active",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865",
      name: "Silverline Banquets",
      location: "Edappally, Kochi",
      guests: 150,
      price: 15000,
      status: "Active",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      name: "Lagoona Beach Resort",
      location: "Cherai, Kochi",
      guests: 200,
      price: 18000,
      status: "Active",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
      name: "The Garden Courtyard",
      location: "Kakkanad, Kochi",
      guests: 100,
      price: 8000,
      status: "Active",
    },
  ];
  const stats = [
    {
      title: "Total Venues",
      value: 12,
      subText: "↑ 2 this month",
      icon: <Building2 className="h-8 w-8 text-teal-600" />,
      color: "text-green-600",
    },
    {
      title: "Active Bookings",
      value: 48,
      subText: "6 upcoming today",
      icon: <CalendarDays className="h-8 w-8 text-blue-600" />,
      color: "text-blue-600",
    },
    {
      title: "Pending Requests",
      value: 7,
      subText: "Need your approval",
      icon: <Clock3 className="h-8 w-8 text-orange-600" />,
      color: "text-orange-600",
    },
    {
      title: "Revenue (This Month)",
      value: "₹1,24,500",
      subText: "↑ 18% from last month",
      icon: <IndianRupee className="h-8 w-8 text-green-600" />,
      color: "text-green-600",
    },
  ];

  return (
     <div className="p-4 md:p-6 xl:p-8">
      {/* Welcome Section */}
      <div className="mb-6 xl:mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl xl:text-4xl">
          Welcome back, Vishnu! 👋
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Here's what's happening with your venues today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subText={stat.subText}
            icon={stat.icon}
            subTextColor={stat.color}
          />
        ))}
      </div>

      {/* Main Layout */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* LEFT SECTION */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
              My Venues
            </h2>

            <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
              View All Venues →
            </button>
          </div>

          {/* Venue Cards */}
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                image={venue.image}
                name={venue.name}
                location={venue.location}
                guests={venue.guests}
                price={venue.price}
                status={venue.status}
              />
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="mt-8 overflow-x-auto">
            <RecentBookings />
          </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">
          <AddVenueCard />
          <TodayAtGlanceCard />
          <ProTipCard />
        </aside>
      </div>
    </div>
    // <div className="p-8">
    //   {/* Welcome Section */}
    //   <div className="mb-8">
    //     <h1 className="text-4xl font-bold text-slate-900">
    //       Welcome back, Vishnu! 👋
    //     </h1>

    //     <p className="mt-2 text-slate-500">
    //       Here's what's happening with your venues today.
    //     </p>
    //   </div>

    //   {/* Stats Cards */}
    //   <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
    //     {stats.map((stat) => (
    //       <StatsCard
    //         key={stat.title}
    //         title={stat.title}
    //         value={stat.value}
    //         subText={stat.subText}
    //         icon={stat.icon}
    //         subTextColor={stat.color}
    //       />
    //     ))}
    //   </div>
    //   <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_260px]">
    //     {/* Left Side */}
    //     <section className="rounded-2xl border bg-white p-6">
    //       <div className="mb-6 flex items-center justify-between">
    //         <h2 className="text-2xl font-semibold">My Venues</h2>

    //         <button className="font-medium text-teal-600">
    //           View All Venues →
    //         </button>
    //       </div>
    //       <div>
    //         <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,340px)]">
    //           {venues.map((venue) => (
    //             <VenueCard
    //               key={venue.id}
    //               image={venue.image}
    //               name={venue.name}
    //               location={venue.location}
    //               guests={venue.guests}
    //               price={venue.price}
    //               status={venue.status}
    //             />
    //           ))}
    //         </div>
    //       </div>
    //       <RecentBookings />
    //     </section>

    //     {/* Right Side */}
    //     <div>
    //       <AddVenueCard />
    //       <TodayAtGlanceCard />
    //       <ProTipCard />
    //     </div>
    //   </div>

    //   <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_260px]">
    //     {/* Left Side */}

    //     {/* Right Side */}
    //   </div>
    //   {/* <RecentBookings /> */}
    // </div>
  );
}
// import React from 'react'

// const page = () => {
//   return (
//     <div>
//      6. Owner Route (/owner)

// This is where you can really impress.

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
