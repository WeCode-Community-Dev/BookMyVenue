import { useEffect } from 'react';
import RevenueOverView from '../components/owner/sections/Revenue/RevenueOverview.tsx';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { getDashboardData, type OwnerDashboardData } from '../services/ownerDashboard.service';
import DashboardSkelton from '../components/owner/loaders/DashboardSkelton';
import UpcomingBookings from '../components/owner/sections/Upcoming/Upcoming.tsx';
import CategoryPerformanceStats from '../components/owner/sections/performance/CategoryPerformance';
import StatCards from '../components/owner/sections/Stats/StatCards.tsx';
import VenueHealth from '../components/owner/sections/venueHealth/VenueHealth.tsx';
import TopPerformingVenues from '../components/owner/sections/topVenues/TopPerformingVenues.tsx';

export default function OwnerDashboard() {
  const { data, loading, execute } = useAsyncFetch<OwnerDashboardData>();

  useEffect(() => {
    execute(getDashboardData);
  }, [execute]);

  useEffect(() => {
    console.log('data recieved in page', data);
  }, [data]);

  if (loading) {
    return <DashboardSkelton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-7 col-span-1 flex flex-col gap-6">
        <StatCards data={data?.statCardData?.data ?? []} />

        <RevenueOverView data={data?.revenueChartData?.data ?? []} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VenueHealth
            data={
              data?.venueHealthData?.data ?? {
                totalVenues: 0,
                activeVenues: 0,
                pendingVenues: 0,
                rejectedVenues: 0,
              }
            }
          />
          <TopPerformingVenues data={data?.topPerformingData?.data ?? []} />
        </div>
      </div>

      <div className="lg:col-span-3 col-span-1 flex flex-col gap-6">
        <CategoryPerformanceStats data={data?.pieChartData?.data ?? []} />

        <UpcomingBookings data={data?.upcomingData?.data ?? []} />
      </div>
    </div>
  );
}
