"use client";

import { ArrowLeft } from "lucide-react";

export default function VenueHeader() {
  return (
    <div className="mb-4 lg:mb-5">
      {/* Breadcrumb */}
      <button
        type="button"
        className="mb-2 flex items-center gap-2 text-sm text-slate-500 transition hover:text-teal-600"
      >
        <ArrowLeft className="h-4 w-4" />

        <span>Dashboard</span>

        <span>/</span>

        <span className="font-medium text-slate-700">
          Add New Venue
        </span>
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        Add New Venue
      </h1>

      {/* Description */}
      <p className="mt-1 text-sm text-slate-500 md:text-base">
        Fill in the details below to list your venue and start receiving
        bookings.
      </p>
    </div>
  );
}
