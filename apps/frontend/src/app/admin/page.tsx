// src/app/admin/page.tsx

import AdminBottomSection from "@/components/global/admininfo";
import PendingVenueCard from "@/components/global/approvalcard";
import StatsCard from "@/components/global/statcard";
import { RefreshCw } from "lucide-react";
import {
  Users,
  UserCog,
  Building2,
  CalendarDays,
} from "lucide-react";

export default function Page() {
  const stats = [
    {
      title: "Total Users",
      value: 1248,
      subText: "All registered users",
      icon: <Users className="h-8 w-8 text-teal-600" />,
      color: "text-teal-600",
    },
    {
      title: "Total Owners",
      value: 42,
      subText: "Venue owners",
      icon: <UserCog className="h-8 w-8 text-orange-600" />,
      color: "text-orange-600",
    },
    {
      title: "Total Venues",
      value: 135,
      subText: "Listed venues",
      icon: <Building2 className="h-8 w-8 text-violet-600" />,
      color: "text-violet-600",
    },
    {
      title: "Total Bookings",
      value: 782,
      subText: "All bookings",
      icon: <CalendarDays className="h-8 w-8 text-green-600" />,
      color: "text-green-600",
    },
  ];

  const pendingVenues = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      name: "Lagoona Beach Resort",
      location: "Cherai, Kochi",
      capacity: 200,
      price: 18000,
      owner: "Vishnu Raj",
      submittedOn: "24 May 2025",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
      name: "Silverline Banquets",
      location: "Edappally, Kochi",
      capacity: 150,
      price: 15000,
      owner: "Anjali Sharma",
      submittedOn: "24 May 2025",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865",
      name: "The Garden Courtyard",
      location: "Kakkanad, Kochi",
      capacity: 100,
      price: 8000,
      owner: "Rohit Menon",
      submittedOn: "23 May 2025",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      name: "Palm Grove Residency",
      location: "Kalamassery, Kochi",
      capacity: 80,
      price: 22000,
      owner: "Sneha Nair",
      submittedOn: "23 May 2025",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 xl:p-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome back, Admin! Here's what's happening on your platform.
        </p>
      </div>

      {/* Statistics */}
      <section>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
      </section>

         {/* Pending Venue Approvals */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-slate-900">
                Pending Venue Approvals
              </h2>

              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                {pendingVenues.length}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Venues waiting for your approval
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-teal-600 hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {pendingVenues.map((venue) => (
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
          ))}
        </div>
      </section>
      <AdminBottomSection />

    </div>
  );
}


// import React from 'react'

// const page = () => {
//   return (
//     <div>
//       Admin dashboard and management will be displayed here.

//       7. Admin Route (/admin)
// Must Have

// ✅ Venue Approval

// ✅ User Management

// Impressive

// ⭐ Pending Approval Queue

// Approve
// Reject
// Request Changes

// ⭐ Dashboard Stats

// Total Users
// Total Venues
// Total Bookings
// Revenue
//     </div>
//   )
// }

// export default page
