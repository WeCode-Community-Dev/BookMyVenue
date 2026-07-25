"use client";

import {
  Building2,
  CalendarDays,
  Clock3,
  Star,
  ChevronDown,
} from "lucide-react";

export default function VenueStatisticsCard() {
  const stats = [
    {
      title: "Total Venues",
      value: "12",
      icon: (
        <Building2 className="h-6 w-6 text-teal-600" />
      ),
      bg: "bg-teal-50",
    },
    {
      title: "Active Bookings",
      value: "48",
      icon: (
        <CalendarDays className="h-6 w-6 text-green-600" />
      ),
      bg: "bg-green-50",
    },
    {
      title: "Occupancy Rate",
      value: "96%",
      icon: (
        <Clock3 className="h-6 w-6 text-blue-600" />
      ),
      bg: "bg-blue-50",
    },
    {
      title: "Average Rating",
      value: "4.8",
      icon: (
        <Star className="h-6 w-6 text-amber-500" />
      ),
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50">
            <Building2 className="h-5 w-5 text-teal-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Venue Statistics
            </h3>

            <p className="text-sm text-slate-500">
              Performance of your venues
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
          This Month
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 p-4 transition hover:shadow-sm"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}
            >
              {stat.icon}
            </div>

            <h3 className="text-3xl font-bold text-slate-900">
              {stat.value}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {stat.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}