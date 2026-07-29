import { Users, Building2, CalendarDays, IndianRupee, ArrowUpRight } from 'lucide-react';

function getColorScheme(index: number) {
  if (index === 0) {
    return {
      text: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      border: 'hover:border-blue-500/40 dark:hover:border-blue-500/50 hover:shadow-blue-500/5',
      glow: 'bg-blue-500/5',
      trend: '0%',
      trendLabel: 'vs last month',
      trendType: 'positive',
      progress: 0,
      progressColor: 'bg-blue-500',
    };
  }
  if (index === 1) {
    return {
      text: 'text-emerald-500',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      border:
        'hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-emerald-500/5',
      glow: 'bg-emerald-500/5',
      trend: '0 pending',
      trendLabel: 'approval queue',
      trendType: 'warning',
      progress: 0,
      progressColor: 'bg-emerald-500',
    };
  }
  if (index === 2) {
    return {
      text: 'text-amber-500',
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      border: 'hover:border-amber-500/40 dark:hover:border-amber-500/50 hover:shadow-amber-500/5',
      glow: 'bg-amber-500/5',
      trend: '0%',
      trendLabel: 'vs last month',
      trendType: 'positive',
      progress: 0,
      progressColor: 'bg-amber-500',
    };
  }
  return {
    text: 'text-[#e21a47]',
    bg: 'bg-[#e21a47]/10 dark:bg-[#e21a47]/20',
    border: 'hover:border-[#e21a47]/40 dark:hover:border-[#e21a47]/50 hover:shadow-[#e21a47]/5',
    glow: 'bg-[#e21a47]/5',
    trend: '0%',
    trendLabel: 'vs last month',
    trendType: 'positive',
    progress: 0,
    progressColor: 'bg-[#e21a47]',
  };
}

interface AdminStatCardsProps {
  data?: {
    totalUsers: number;
    totalVenues: number;
    totalBookings: number;
    totalRevenue: number;
  };
}

export default function AdminStatCards({ data }: AdminStatCardsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: data ? data.totalUsers.toLocaleString() : '0',
      icon: <Users className="w-5.5 h-5.5" />,
    },
    {
      title: 'Total Venues',
      value: data ? data.totalVenues.toLocaleString() : '0',
      icon: <Building2 className="w-5.5 h-5.5" />,
    },
    {
      title: 'Total Bookings',
      value: data ? data.totalBookings.toLocaleString() : '0',
      icon: <CalendarDays className="w-5.5 h-5.5" />,
    },
    {
      title: 'Total Revenue',
      value: data ? `₹${(data.totalRevenue / 100000).toFixed(1)}L` : '₹0.0L',
      icon: <IndianRupee className="w-5.5 h-5.5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const color = getColorScheme(index);
        return (
          <div
            key={stat.title}
            className={`rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-[#1a1a1a] p-5 shadow-xl relative overflow-hidden group transition-all duration-300 ${color.border}`}
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300 ${color.glow}`}
            />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550">
                {stat.title}
              </span>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${color.bg} ${color.text}`}
              >
                {stat.icon}
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-black tracking-tight text-black dark:text-white">
                {stat.value}
              </span>
            </div>

            <div className="space-y-2">
              <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color.progressColor}`}
                  style={{ width: `${color.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium text-zinc-400 dark:text-zinc-550">
                <span
                  className={`flex items-center gap-0.5 font-bold ${
                    color.trendType === 'positive'
                      ? 'text-emerald-500'
                      : color.trendType === 'warning'
                        ? 'text-amber-500'
                        : 'text-rose-500'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {color.trend}
                </span>
                <span>{color.trendLabel}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
