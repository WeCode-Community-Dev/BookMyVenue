import { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function VenueRevenueTable({ venueRevenue }) {
  const [sortBy, setSortBy] = useState("revenue");

  const sorted = [...venueRevenue].sort((a, b) => b[sortBy] - a[sortBy]);
  const maxRevenue = Math.max(...venueRevenue.map((v) => v.revenue));

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-900">Revenue by Venue</h3>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-xs">
          {[
            { key: "revenue", label: "Revenue" },
            { key: "bookings", label: "Bookings" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`rounded-md px-3 py-1 font-medium transition ${
                sortBy === opt.key
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {sorted.map((v) => {
          const widthPct = (v.revenue / maxRevenue) * 100;
          const isUp = v.trend >= 0;

          return (
            <div key={v.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{v.name}</p>
                  <p className="text-xs text-gray-400">{v.category} · {v.bookings} bookings</p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`flex items-center gap-1 text-xs font-medium ${
                      isUp ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(v.trend)}%
                  </span>
                  <span className="w-24 text-right text-sm font-bold text-gray-900">
                    ₹{v.revenue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  style={{ width: `${widthPct}%` }}
                  className="h-2 rounded-full bg-red-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}