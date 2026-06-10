"use client";

import { MapPin, Search } from "lucide-react";

export default function LocationForm() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 lg:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <MapPin className="h-5 w-5 text-teal-600" />

        <div>
          <h2 className="font-semibold text-slate-900">
            5. Location
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search or pin the exact location of your venue
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          placeholder="Search for an address or area"
          className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {/* Map */}
      <div className="h-[320px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 lg:h-[380px]">
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-slate-500">
            OpenLayers Map Here
          </p>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Drag the marker to adjust the exact location
      </p>

      {/* Coordinates */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Latitude
          </label>

          <input
            value="10.0330"
            readOnly
            className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Longitude
          </label>

          <input
            value="76.3454"
            readOnly
            className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm"
          />
        </div>
      </div>

      {/* Address */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Address
        </label>

        <input
          placeholder="Full address"
          className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {/* Landmark */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Landmark (Optional)
        </label>

        <input
          placeholder="Near Metro Station"
          className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>
    </div>
  );
}
