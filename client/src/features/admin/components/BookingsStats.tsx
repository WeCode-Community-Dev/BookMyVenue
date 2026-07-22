// src/features/admin/components/admin-bookings/BookingsStats.tsx
import { CalendarDays, CheckCircle2, XCircle } from 'lucide-react';
import type { BookingsStatsProps } from '../types/bookings/AdminBookings.types';

const BookingsStats = ({ stats, loading }: BookingsStatsProps) => {
  const StatCard = ({ icon, label, value, colorClass }: any) => (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className={`rounded-xl p-3 ${colorClass}`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{loading ? '...' : value}</p>
      </div>
    </div>
  );

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Bookings"
        value={stats.total}
        colorClass="bg-primary/10 text-primary"
        icon={<CalendarDays size={22} className="stroke-[1.5]" />}
      />
      <StatCard
        label="Confirmed"
        value={stats.confirmedCount}
        colorClass="bg-emerald-500/10 text-emerald-500"
        icon={<CheckCircle2 size={22} className="stroke-[1.5]" />}
      />
      <StatCard
        label="Completed"
        value={stats.completedCount}
        colorClass="bg-purple-500/10 text-purple-500"
        icon={<CheckCircle2 size={22} className="stroke-[1.5]" />}
      />
      <StatCard
        label="Cancelled"
        value={stats.cancelledCount}
        colorClass="bg-rose-500/10 text-rose-500"
        icon={<XCircle size={22} className="stroke-[1.5]" />}
      />
    </div>
  );
};

export default BookingsStats;