// components/admin/PendingVenueCard.tsx

"use client";

import {
  MapPin,
  Users,
  IndianRupee,
  User,
  CalendarDays,
} from "lucide-react";

interface PendingVenueCardProps {
  image: string;
  name: string;
  location: string;
  capacity: number;
  price: number;
  owner: string;
  submittedOn: string;
}

export default function PendingVenueCard({
  image,
  name,
  location,
  capacity,
  price,
  owner,
  submittedOn,
}: PendingVenueCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">

      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="h-48 w-full object-cover"
        />

        <span className="absolute right-3 top-3 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          Pending
        </span>
      </div>

      {/* Content */}
      <div className="p-4">

        <h3 className="text-lg font-semibold text-slate-900">
          {name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          {location}
        </div>

        <div className="mt-4 space-y-3">

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-500">
              <Users className="h-4 w-4" />
              Capacity
            </span>

            <span className="font-medium text-slate-800">
              {capacity} Guests
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-500">
              <IndianRupee className="h-4 w-4" />
              Price
            </span>

            <span className="font-medium text-slate-800">
              ₹{price.toLocaleString()}/day
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-500">
              <User className="h-4 w-4" />
              Owner
            </span>

            <span className="font-medium text-slate-800">
              {owner}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-500">
              <CalendarDays className="h-4 w-4" />
              Submitted
            </span>

            <span className="font-medium text-slate-800">
              {submittedOn}
            </span>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-3">

          <button className="rounded-lg border border-teal-600 py-2 text-sm font-medium text-teal-600 transition hover:bg-teal-50">
            View Details
          </button>

          <button className="rounded-lg bg-teal-600 py-2 text-sm font-medium text-white transition hover:bg-teal-700">
            Approve
          </button>

        </div>

      </div>
    </div>
  );
}