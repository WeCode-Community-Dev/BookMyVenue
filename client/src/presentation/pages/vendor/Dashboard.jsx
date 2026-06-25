import React from 'react';
import VendorSidebar from '@/presentation/components/vendor/VendorSidebar';
import VendorNavbar from '@/presentation/components/vendor/VendorNavbar';
import DashboardCard from '@/presentation/components/vendor/dashboard/DashboardCard';
import RecentBookings from '@/presentation/components/vendor/dashboard/RecentBookings';
import TopVenues from '@/presentation/components/vendor/dashboard/TopVenues';
import QuickActions from '@/presentation/components/vendor/dashboard/QuickActions';
import BookingTrends from '@/presentation/components/vendor/dashboard/BookingTrends';
import RevenueChart from '@/presentation/components/vendor/dashboard/RevenueChart';
import WelcomeBanner from "@/presentation/components/vendor/WelcomeBanner";


const Dashboard = () => {
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

          <div className='grid grid-cols-4 gap-4'>
            <DashboardCard title="Total venues" value="12"/> 
            <DashboardCard title="Active venues" value="9"/>          
            <DashboardCard title="Bookings" value="245"/>          
            <DashboardCard title="Revenue" value="45,000"/>          

          </div>

          <div className='grid grid-cols-2 gap-6 mt-8'>
            <BookingTrends />
            <RevenueChart />
          </div>

          <div className='grid grid-cols-2 gap-6 mt-8'>
            <div  className='bg-white shadow rounded-lg p-6'>
              <QuickActions />
            </div>
            <div className='bg-white shadow rounded-lg p-6'>
              < RecentBookings />
            </div>
          </div>
          
          <div className='mt-8 bg-white shadow rounded-lg p-6'>
            <TopVenues/>
          </div>
        </main>

      </div>
      
    </div>
  );
};

export default Dashboard
