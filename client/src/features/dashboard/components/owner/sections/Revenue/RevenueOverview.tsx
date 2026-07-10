import { useState } from 'react';
import { TrendingUp, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';
import RevenueChart from './RevenueChart';
import type {
  FilterType,
  RevenueTitleProps,
  RevenueChartProps,
} from '../../../../types/ownerDashbord.types.ts';

type RevenuePoint = {
  period: string;
  revenue: number;
  bookings: number;
};

export default function RevenueOverView({ data }: RevenueChartProps) {
  const [filter, setFilter] = useState<FilterType>('monthly');

  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300">
      <RevenueTitle filter={filter} setFilter={setFilter} chartData={data} />

      <div className="mt-6">
        <RevenueChart data={data} />
      </div>
    </div>
  );
}

// --------------------
// Title Component
// --------------------
function RevenueTitle({
  filter,
  setFilter,
  chartData,
}: RevenueTitleProps & {
  chartData: RevenuePoint[];
}) {
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  const totalBookings = chartData.reduce((sum, item) => sum + item.bookings, 0);

  const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
              Performance Indicators
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
          </div>
          <h2 className="text-lg font-bold tracking-tight mt-1 text-black dark:text-white leading-none">
            Revenue <span className="text-[#e21a47]">Overview</span>
          </h2>
        </div>

        {/* Filter Switcher Pill */}
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

      {/* Grid of Key Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Revenue */}
        <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-[#e21a47]/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#e21a47]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Earnings
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#e21a47]/10 flex items-center justify-center text-[#e21a47]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg font-black text-black dark:text-white tracking-tight">
              ₹{totalRevenue.toLocaleString()}
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +12.5%
            </span>
          </div>
        </div>

        {/* Card 2: Bookings */}
        <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Bookings
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg font-black text-black dark:text-white tracking-tight">
              {totalBookings}
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +8.2%
            </span>
          </div>
        </div>

        {/* Card 3: Avg Booking Value */}
        <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Avg / Book
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
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
  );
}
