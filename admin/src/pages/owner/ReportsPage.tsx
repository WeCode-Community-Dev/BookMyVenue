import { useMemo } from "react";
import { useParams } from "react-router";
import { TrendingUp, DollarSign, CalendarCheck, BarChart3 } from "lucide-react";
import { useApiQuery } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { PROFILE_STALE_TIME } from "@/constants/queryConfig";
import type { MonthData } from "@/types/reports.types";

// Extracted Components
import { RevenueChart } from "@/components/reports/RevenueChart";
import { MonthlyBreakdownTable } from "@/components/reports/MonthlyBreakdownTable";

interface AnalyticsResponse {
  months: MonthData[];
}

const MONTH_NAMES: Record<string, string> = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="rounded-md border border-[var(--bg-grey)] bg-[var(--bg-primary)] p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {value}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { venueId } = useParams<{ venueId: string }>();

  const { data, isLoading } = useApiQuery<AnalyticsResponse>(
    QUERY_KEYS.OWNER_ANALYTICS(venueId!),
    { method: "GET", url: `${API_ENDPOINTS.OWNER_ANALYTICS}/${venueId!}` },
    { staleTime: PROFILE_STALE_TIME, enabled: !!venueId },
  );

  const months = useMemo(() => data?.months ?? [], [data]);

  const chartData = useMemo(
    () =>
      months.map((m) => ({
        label: `${MONTH_NAMES[m.month] ?? m.month} '${m.year.slice(2)}`,
        revenue: m.revenue,
        bookings: m.count,
      })),
    [months],
  );

  const totalRevenue = useMemo(
    () => months.reduce((acc, m) => acc + m.revenue, 0),
    [months],
  );
  const totalBookings = useMemo(
    () => months.reduce((acc, m) => acc + m.count, 0),
    [months],
  );
  const avgMonthlyRevenue = useMemo(
    () => (months.length > 0 ? Math.round(totalRevenue / months.length) : 0),
    [totalRevenue, months],
  );

  return (
    <div className="space-y-8 p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Financial Reports
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Revenue and booking performance — completed bookings only
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--text-primary)]">
          <BarChart3 className="h-5 w-5 text-[var(--bg-primary)]" />
        </div>
      </div>

      {/* Metric Cards */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-[var(--bg-grey)] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            subtitle="All-time earnings"
            icon={DollarSign}
            accent="bg-emerald-500 shadow-emerald-500/20"
          />
          <MetricCard
            title="Total Bookings"
            value={totalBookings.toString()}
            subtitle="Completed successful bookings"
            icon={CalendarCheck}
            accent="bg-blue-500 shadow-blue-500/20"
          />
          <MetricCard
            title="Avg. Monthly Revenue"
            value={`₹${avgMonthlyRevenue.toLocaleString("en-IN")}`}
            subtitle="Based on active months"
            icon={TrendingUp}
            accent="bg-purple-500 shadow-purple-500/20"
          />
        </div>
      )}

      <RevenueChart chartData={chartData} isLoading={isLoading} />

      {/* Table Section */}
      <MonthlyBreakdownTable
        months={months}
        monthNames={MONTH_NAMES}
        isLoading={isLoading}
      />
    </div>
  );
}
