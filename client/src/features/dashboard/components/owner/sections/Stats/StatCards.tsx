import type React from 'react';
import type { StatCardProps } from '@/features/dashboard/types/ownerDashbord.types';
import { IndianRupee, CalendarDays, Building2, Star, TrendingUp } from 'lucide-react';

interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  index: number;
}

function getIconForTitle(title: string, customIcon?: React.ReactNode) {
  if (customIcon) return customIcon;

  const t = title.toLowerCase();
  if (t.includes('revenue') || t.includes('earning') || t.includes('sales')) {
    return <IndianRupee className="w-5 h-5" />;
  }
  if (t.includes('booking') || t.includes('schedule')) {
    return <CalendarDays className="w-5 h-5" />;
  }
  if (t.includes('venue') || t.includes('property') || t.includes('hall')) {
    return <Building2 className="w-5 h-5" />;
  }
  if (t.includes('rating') || t.includes('review') || t.includes('star')) {
    return <Star className="w-5 h-5" />;
  }
  return <TrendingUp className="w-5 h-5" />;
}

function getColorScheme(title: string, index: number) {
  const t = title.toLowerCase();
  if (t.includes('revenue') || t.includes('earning') || index === 0) {
    return {
      text: 'text-[#e21a47]',
      bg: 'bg-[#e21a47]/10 dark:bg-[#e21a47]/20',
      border: 'hover:border-[#e21a47]/30 dark:hover:border-[#e21a47]/40',
      glow: 'bg-[#e21a47]/5',
      trendColor: 'text-emerald-500',
      trend: '+12.5% vs last month',
    };
  }
  if (t.includes('booking') || index === 1) {
    return {
      text: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      border: 'hover:border-amber-500/30 dark:hover:border-amber-500/40',
      glow: 'bg-amber-500/5',
      trendColor: 'text-emerald-500',
      trend: '+8.2% vs last month',
    };
  }
  if (t.includes('venue') || index === 2) {
    return {
      text: 'text-emerald-500',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      border: 'hover:border-emerald-500/30 dark:hover:border-emerald-500/40',
      glow: 'bg-emerald-500/5',
      trendColor: 'text-emerald-500',
      trend: 'All systems active',
    };
  }
  return {
    text: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    border: 'hover:border-blue-500/30 dark:hover:border-blue-500/40',
    glow: 'bg-blue-500/5',
    trendColor: 'text-zinc-500 dark:text-zinc-400',
    trend: 'Based on 84 reviews',
  };
}

export default function StatCards({ data }: StatCardProps) {
  console.log('stats data', data);
  const displayData = data
    ? data
    : [
        { title: 'Total Revenue', value: '--' },
        { title: 'Total Bookings', value: '--' },
        { title: 'Active Venues', value: '--' },
        { title: 'Avg Rating', value: '--' },
      ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {displayData.map((stat, index) => (
        <Card
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={getIconForTitle(stat.title)}
          index={index}
        />
      ))}
    </div>
  );
}

function Card({ title, value, icon, index }: CardProps) {
  const colors = getColorScheme(title, index);
  const resolvedIcon = getIconForTitle(title, icon);

  const hasData = value !== '--';

  return (
    <div
      className={`rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-[#1a1a1a] p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group ${colors.border}`}
    >
      <div
        className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300 ${colors.glow}`}
      />

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {title}
        </span>

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${colors.bg} ${colors.text}`}
        >
          {resolvedIcon}
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">{value}</h2>

        <p className="text-[10px] font-bold mt-1.5 text-zinc-400 dark:text-zinc-500">
          {hasData ? colors.trend : 'No data available'}
        </p>
      </div>
    </div>
  );
}
