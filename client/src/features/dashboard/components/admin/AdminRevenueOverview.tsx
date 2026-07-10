import { useState } from 'react';
import { IndianRupee, ArrowUpRight, TrendingUp, DollarSign } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    dataKey: string | number;
  }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/85 p-4 rounded-2xl shadow-xl">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
          {label}
        </p>
        <div className="space-y-2">
          {payload.map((entry, index) => {
            const dotColor =
              entry.dataKey === 'revenue' ? 'var(--color-primary)' : 'var(--color-success)';

            return (
              <div key={index} className="flex items-center justify-between gap-8">
                <span className="text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2 font-medium">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  {entry.name}:
                </span>
                <span className="text-xs font-black text-zinc-900 dark:text-white">
                  ₹{entry.value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

interface AdminRevenueOverviewProps {
  data?: {
    period: string;
    revenue: number;
    commission: number;
  }[];
}

export default function AdminRevenueOverview({ data = [] }: AdminRevenueOverviewProps) {
  const [filter, setFilter] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const chartData = data;

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCommission = chartData.reduce((sum, item) => sum + item.commission, 0);
  const avgBookingValue = totalRevenue > 0 ? Math.round(totalRevenue / 4821) : 0; // using 4821 bookings from stats

  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300">
      {/* Title Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
                Financials
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
            </div>
            <h2 className="text-lg font-bold tracking-tight mt-1 text-black dark:text-white leading-none">
              Revenue <span className="text-[#e21a47]">Overview</span>
            </h2>
          </div>

          {/* Filter Switcher */}
          <div className="flex bg-zinc-100 dark:bg-zinc-900/60 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800 w-fit">
            {(['weekly', 'monthly', 'yearly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  filter === t
                    ? 'bg-white dark:bg-zinc-800 text-[#e21a47] dark:text-[#f56565] shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Mini stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Total Revenue */}
          <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-[#e21a47]/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#e21a47]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Gross Revenue
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#e21a47]/10 flex items-center justify-center text-[#e21a47]">
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-lg font-black text-black dark:text-white tracking-tight">
                ₹{(totalRevenue / 100000).toFixed(2)}L
              </h3>
              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-3 h-3" />
                +12.5%
              </span>
            </div>
          </div>

          {/* Platform Commission */}
          <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Platform Commission
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-lg font-black text-black dark:text-white tracking-tight">
                ₹{(totalCommission / 1000).toFixed(1)}k
              </h3>
              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-3 h-3" />
                15% Net Cut
              </span>
            </div>
          </div>

          {/* Avg Booking Value */}
          <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Avg Value / Booking
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <h3 className="text-lg font-black text-black dark:text-white tracking-tight">
                ₹{avgBookingValue.toLocaleString()}
              </h3>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold flex items-center gap-0.5 mt-0.5">
                Stable
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[40vh] lg:h-[280px] mt-6 relative z-10">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{
                top: 10,
                right: 0,
                left: -15,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="currentColor"
                opacity={0.08}
                strokeDasharray="4 4"
                vertical={false}
                className="text-zinc-200 dark:text-zinc-800"
              />

              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 550 }}
                className="text-zinc-400 dark:text-zinc-500"
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 550 }}
                tickFormatter={(val) => `₹${val / 1000}k`}
                className="text-zinc-400 dark:text-zinc-500"
                dx={-8}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: 'currentColor',
                  strokeWidth: 1,
                  strokeOpacity: 0.08,
                  strokeDasharray: '4 4',
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                height={40}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-zinc-500 dark:text-zinc-400 font-bold tracking-wider text-xs uppercase ml-1.5">
                    {value}
                  </span>
                )}
                wrapperStyle={{
                  paddingBottom: '20px',
                }}
              />

              <Area
                name="Gross Revenue"
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                strokeWidth={3}
                fill="url(#revenueGrad)"
                dot={{
                  r: 4,
                  stroke: 'var(--color-primary)',
                  strokeWidth: 2,
                  fill: 'var(--color-card)',
                }}
                activeDot={{
                  r: 6,
                  stroke: 'var(--color-primary)',
                  strokeWidth: 2,
                  fill: 'var(--color-card)',
                }}
              />

              <Line
                name="Platform Commission"
                type="monotone"
                dataKey="commission"
                stroke="var(--color-success)"
                strokeWidth={3}
                dot={{
                  r: 4,
                  stroke: 'var(--color-success)',
                  strokeWidth: 2,
                  fill: 'var(--color-card)',
                }}
                activeDot={{
                  r: 6,
                  stroke: 'var(--color-success)',
                  strokeWidth: 2,
                  fill: 'var(--color-card)',
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-550 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <IndianRupee className="w-8 h-8 mb-2 opacity-40 animate-pulse text-[#e21a47]" />
            <span className="text-xs font-bold uppercase tracking-wider">Data not available</span>
          </div>
        )}
      </div>
    </div>
  );
}
