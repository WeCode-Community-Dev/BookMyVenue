import { Link } from "react-router-dom";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

const RANGE_OPTIONS = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
];

function RevenueOverview({
  revenue,
  loading,
  range = "this_month",
  onRangeChange,
  showFullReportLink = true,
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-rose-900">Revenue Overview</h3>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => onRangeChange?.(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-500"
          >
            {RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {showFullReportLink && (
            <Link to="/owner/revenue" className="text-xs font-medium text-rose-700 hover:underline">
              Full Report
            </Link>
          )}
        </div>
      </div>

      {loading || !revenue ? (
        <div className="h-[170px] mt-4 bg-gray-50 rounded-xl animate-pulse" />
      ) : (
        <>
          <p className="text-2xl font-bold text-gray-900 mt-3">
            ₹{revenue.total_revenue.toLocaleString("en-IN")}
          </p>
          <p className="flex items-center gap-1 text-xs font-medium text-emerald-600 mt-1">
            <TrendingUp size={13} /> {revenue.change_pct}% vs last month (₹
            {revenue.previous_total.toLocaleString("en-IN")})
          </p>

          <div className="h-[150px] mt-3 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue.series} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#881337" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#881337" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) =>
                    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
                  }
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                  labelFormatter={(d) =>
                    new Date(d).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  }
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#881337"
                  strokeWidth={2.5}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default RevenueOverview;
