import {
  Building2,
  CalendarDays,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";

const defaultStats = {
  totalVenues: 0,
  totalBookings: 0,
  pendingRequests: 0,
  totalRevenue: 0,
  occupancyRate: 0,
  activeListings: 0,
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
};

const formatPercent = (value) => {
  return `${Math.round((value ?? 0) * 100) / 100}%`;
};

export function DashboardStats({ stats = defaultStats, isLoading = false }) {
  const statItems = [
    {
      id: "totalVenues",
      label: "Total Venues",
      value: formatNumber(stats.totalVenues),
      icon: Building2,
      accent: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "activeListings",
      label: "Active Listings",
      value: formatNumber(stats.activeListings),
      icon: TrendingUp,
      accent: "bg-emerald-500/10 text-emerald-500",
    },
    {
      id: "totalBookings",
      label: "Total Bookings",
      value: formatNumber(stats.totalBookings),
      icon: CalendarDays,
      accent: "bg-purple-500/10 text-purple-500",
    },
    {
      id: "pendingRequests",
      label: "Pending Requests",
      value: formatNumber(stats.pendingRequests),
      icon: Clock,
      accent: "bg-amber-500/10 text-amber-500",
    },
    {
      id: "totalRevenue",
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      accent: "bg-rose-500/10 text-rose-500",
    },
    {
      id: "occupancyRate",
      label: "Occupancy Rate",
      value: formatPercent(stats.occupancyRate),
      icon: Users,
      accent: "bg-cyan-500/10 text-cyan-500",
    },
  ];

  return (
    <section aria-label="Dashboard statistics" className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white/60">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    {isLoading ? (
                      <span className="inline-block h-7 w-20 animate-pulse rounded bg-white/10" />
                    ) : (
                      item.value
                    )}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.accent}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DashboardStats;
