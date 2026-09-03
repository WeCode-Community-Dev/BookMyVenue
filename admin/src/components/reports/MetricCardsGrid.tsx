import { TrendingUp, DollarSign, CalendarCheck } from "lucide-react";
import { MetricCard } from "@/components/common/MetricCard";

export function MetricCardsGrid({
  isLoading,
  totalRevenue,
  totalBookings,
  avgMonthlyRevenue,
  monthsLength,
}: {
  isLoading: boolean;
  totalRevenue: number;
  totalBookings: number;
  avgMonthlyRevenue: number;
  monthsLength: number;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-zinc-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <MetricCard
        title="Total Revenue"
        value={`₹${totalRevenue.toLocaleString("en-IN")}`}
        subtitle="All completed bookings"
        icon={DollarSign}
        accent="bg-emerald-500"
      />
      <MetricCard
        title="Total Bookings"
        value={totalBookings.toLocaleString()}
        subtitle="Completed transactions"
        icon={CalendarCheck}
        accent="bg-blue-500"
      />
      <MetricCard
        title="Avg Monthly Revenue"
        value={`₹${avgMonthlyRevenue.toLocaleString("en-IN")}`}
        subtitle={`Over ${monthsLength} active months`}
        icon={TrendingUp}
        accent="bg-violet-500"
      />
    </div>
  );
}
