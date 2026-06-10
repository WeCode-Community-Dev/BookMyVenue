"use client";

import Image from "next/image";
import { ChevronRight, Building2 } from "lucide-react";

type Venue = {
  id: number;
  image: string;
  name: string;
  location: string;
  status: "Active" | "Pending" | "Inactive";
};

interface MyVenuesCardProps {
  venues: Venue[];
}

export default function MyVenuesCard({
  venues,
}: MyVenuesCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50">
            <Building2 className="h-5 w-5 text-teal-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              My Venues
            </h3>

            <p className="text-sm text-slate-500">
              Venues you have listed
            </p>
          </div>
        </div>

        <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
          View All Venues →
        </button>
      </div>

      {/* Venue List */}
      <div className="space-y-4">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="flex items-center gap-4 bg-teal-50 rounded-xl p-2 transition hover:bg-slate-50"
          >
            <Image
              src={venue.image}
              alt={venue.name}
              width={80}
              height={60}
              className="h-14 w-20 rounded-lg object-cover"
            />

            <div className="min-w-0 flex-1">
              <h4 className="truncate font-medium text-slate-900">
                {venue.name}
              </h4>

              <p className="truncate text-sm text-slate-500">
                {venue.location}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                venue.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : venue.status === "Pending"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {venue.status}
            </span>

            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
        ))}
      </div>
    </div>
  );
}