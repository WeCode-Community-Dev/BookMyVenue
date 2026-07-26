"use client";

import { TrendingUp, ChevronDown } from "lucide-react";

export default function RevenueSummaryCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50">
            <TrendingUp className="h-5 w-5 text-teal-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Revenue Summary
            </h3>

            <p className="text-sm text-slate-500">
              Overview of your earnings
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
          This Month
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Revenue */}
      <div>
        <h2 className="text-4xl font-bold text-slate-900">
          ₹1,24,500
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Total Revenue
        </p>

        <p className="mt-3 text-sm font-medium text-green-600">
          ↑ 18% from last month
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-200">
        <div className="border-r border-slate-200 p-4 text-center">
          <h4 className="text-xl font-semibold text-slate-900">
            ₹92,000
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            Completed
          </p>
        </div>

        <div className="border-r border-slate-200 p-4 text-center">
          <h4 className="text-xl font-semibold text-slate-900">
            ₹20,500
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            Upcoming
          </p>
        </div>

        <div className="p-4 text-center">
          <h4 className="text-xl font-semibold text-slate-900">
            ₹12,000
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            Pending Payout
          </p>
        </div>
      </div>
    </div>
  );
}