import { BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "@/components/common/CustomTooltip";

export function RevenueChart({
  isLoading,
  chartData,
}: {
  isLoading: boolean;
  chartData: { label: string; revenue: number; bookings: number }[];
}) {
  return (
    <div className="rounded-md border p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Monthly Revenue
          </h2>
          <p className="text-sm text-zinc-400">
            Revenue trend from completed bookings
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-72 animate-pulse rounded-xl bg-zinc-100" />
      ) : chartData.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200">
          <BarChart3 className="h-10 w-10 text-zinc-300" />
          <p className="text-sm text-zinc-400">No completed bookings yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={288}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f4f5f7"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#revenueGrad)"
              dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#10b981", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
