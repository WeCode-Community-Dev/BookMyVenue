"use client";

import { Users } from "lucide-react";

export default function CapacityPricingForm() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 lg:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Users className="h-5 w-5 text-teal-600" />

        <h2 className="font-semibold text-slate-900">
          2. Capacity & Pricing
        </h2>
      </div>

      {/* First Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Min Guests *
          </label>

          <input
            type="number"
            placeholder="e.g. 50"
            className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Max Guests *
          </label>

          <input
            type="number"
            placeholder="e.g. 500"
            className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Price Per Day (₹) *
          </label>

          <input
            type="number"
            placeholder="e.g. 25000"
            className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Security Deposit (₹)
          </label>

          <input
            type="number"
            placeholder="e.g. 5000"
            className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Extra Guest Price (₹)
          </label>

          <input
            type="number"
            placeholder="e.g. 500"
            className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>
    </div>
  );
}

