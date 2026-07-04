import React, { useEffect, useState } from 'react';
import VendorSidebar from '@/presentation/components/vendor/VendorSidebar';
import VendorNavbar from '@/presentation/components/vendor/VendorNavbar';
import DashboardCard from '@/presentation/components/vendor/dashboard/DashboardCard';
import RecentBookings from '@/presentation/components/vendor/dashboard/RecentBookings';
import TopVenues from '@/presentation/components/vendor/dashboard/TopVenues';
import QuickActions from '@/presentation/components/vendor/dashboard/QuickActions';
import BookingTrends from '@/presentation/components/vendor/dashboard/BookingTrends';
import RevenueChart from '@/presentation/components/vendor/dashboard/RevenueChart';
import WelcomeBanner from '@/presentation/components/vendor/WelcomeBanner';
import api from '@/lib/axios';
import { API_ROUTES } from '@/constatnts/apiRoutes';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalVenues: 0,
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
    },
    topVenues: [],
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(API_ROUTES.VENDOR.DASHBOARD);
        const payload = response?.data?.data || {};
        setDashboardData({
          stats: payload.stats || {},
          topVenues: payload.topVenues || [],
          recentBookings: payload.recentBookings || [],
        });
      } catch (err) {
        console.error(err);
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = dashboardData.stats || {};

  return (
    <div className='flex'>
      <VendorSidebar />
      <div className='flex-1'>
        <VendorNavbar />

        <main className='p-6'>
          <h1 className='text-3xl font-bold mb-6'>
            Vendor Dashboard
          </h1>
          <WelcomeBanner />

          {error && <p className='mb-4 text-sm text-red-500'>{error}</p>}
          {loading && <p className='mb-4 text-sm text-gray-500'>Loading dashboard...</p>}

          <div className='grid grid-cols-4 gap-4'>
            <DashboardCard title="Total venues" value={stats.totalVenues ?? 0} />
            <DashboardCard title="Pending bookings" value={stats.pendingBookings ?? 0} />
            <DashboardCard title="Confirmed bookings" value={stats.confirmedBookings ?? 0} />
            <DashboardCard title="Completed bookings" value={stats.completedBookings ?? 0} />
          </div>

          <div className='grid grid-cols-2 gap-6 mt-8'>
            <BookingTrends />
            <RevenueChart />
          </div>

          <div className='grid grid-cols-2 gap-6 mt-8'>
            <div className='bg-white shadow rounded-lg p-6'>
              <QuickActions />
            </div>
            <div className='bg-white shadow rounded-lg p-6'>
              <RecentBookings bookings={dashboardData.recentBookings} />
            </div>
          </div>

          <div className='mt-8 bg-white shadow rounded-lg p-6'>
            <TopVenues venues={dashboardData.topVenues} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard
