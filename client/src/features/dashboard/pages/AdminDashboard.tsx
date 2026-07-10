import AdminStatCards from '../components/admin/AdminStatCards';
import BookingOverview from '../components/admin/BookingOverview';
import AdminRevenueOverview from '../components/admin/AdminRevenueOverview';
import CategoryPerformanceStats from '../components/owner/sections/performance/CategoryPerformance';
import RecentActivity from '../components/admin/RecentActivity';
import PendingActions from '../components/admin/PendingActions';
import AlertsPanel from '../components/admin/AlertsPanel';
import PlatformLeaders from '../components/admin/PlatformLeaders';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { useEffect } from 'react';
import type { AdminDashboardData } from '../types/adminDashboard.types';
import { getAdminDashboardData } from '../services/adminDashboar.services';

export default function AdminDashboard() {
  const { data, execute } = useAsyncFetch<AdminDashboardData>();

  useEffect(() => {
    execute(getAdminDashboardData);
  }, [execute]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 w-full pb-8">
      {/* LEFT COLUMN: Core Analytics & Leaders (70% width) */}
      <div className="lg:col-span-7 col-span-1 flex flex-col gap-6">
        {/* SECTION 1 — PLATFORM OVERVIEW */}
        <AdminStatCards data={data?.stats} />

        {/* SECTION 3 — ANALYTICS (Side-by-side charts) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminRevenueOverview data={data?.revenueChart || []} />
          <BookingOverview data={data?.bookingChart || []} />
        </div>

        {/* SECTION 4 — PLATFORM PERFORMANCE (Leaderboard) */}
        <PlatformLeaders data={data?.platformLeaders} />

        {/* SECTION 5 — PLATFORM INSIGHTS (Distribution and logs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryPerformanceStats data={data?.categoryPerformance || []} />
          <RecentActivity data={data?.recentActivity || []} />
        </div>
      </div>

      {/* RIGHT COLUMN: Operational Sidebar (30% width) */}
      <div className="lg:col-span-3 col-span-1 flex flex-col gap-6">
        {/* SECTION 2 — ACTION CENTER (Stacked lists) */}
        <AlertsPanel data={data?.alerts} />
        <PendingActions data={data?.pendingActions} />
      </div>
    </div>
  );
}
