"use client";

import { CheckSquare, Plus } from "lucide-react";

const amenities = [
  "Parking",
  "AC / Air Conditioned",
  "WiFi",
  "Catering Allowed",
  "Power Backup",
  "Generator",
  "Music Allowed",
  "Alcohol Allowed",
  "Decoration Allowed",
];

export default function AmenitiesForm() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 lg:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <CheckSquare className="h-5 w-5 text-teal-600" />

        <h2 className="font-semibold text-slate-900">
          3. Amenities
        </h2>
      </div>

      {/* Amenities Grid */}
      <div className="grid gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((item) => (
          <label
            key={item}
            className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
          >
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />

            <span>{item}</span>
          </label>
        ))}
      </div>

      {/* Add More */}
      <button
        type="button"
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
      >
        <Plus className="h-4 w-4" />
        Add More Amenities
      </button>
    </div>
  );
}

