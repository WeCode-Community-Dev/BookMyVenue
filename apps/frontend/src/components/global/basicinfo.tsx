"use client";

import { Info } from "lucide-react";

export default function BasicInformationForm() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 lg:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Info className="h-5 w-5 text-teal-600" />

        <h2 className="font-semibold text-slate-900">
          1. Basic Information
        </h2>
      </div>

      {/* Fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Venue Name *
          </label>

          <input
            type="text"
            placeholder="Enter venue name"
            className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Venue Type *
          </label>

          <select className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
            <option>Select venue type</option>
            <option>Banquet Hall</option>
            <option>Resort</option>
            <option>Auditorium</option>
            <option>Convention Center</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Short Description *
        </label>

        <textarea
          rows={3}
          maxLength={200}
          placeholder="Describe your venue in a few words..."
          className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />

        <div className="mt-1 text-right text-xs text-slate-400">
          0 / 200
        </div>
      </div>
    </div>
  );
}

