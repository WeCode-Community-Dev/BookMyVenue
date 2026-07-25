import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
import DashboardCard from "@/presentation/components/vendor/dashboard/DashboardCard";
import RecentBookings from "@/presentation/components/vendor/dashboard/RecentBookings";
import TopVenues from "@/presentation/components/vendor/dashboard/TopVenues";
import QuickActions from "@/presentation/components/vendor/dashboard/QuickActions";
import BookingTrends from "@/presentation/components/vendor/dashboard/BookingTrends";
import RevenueChart from "@/presentation/components/vendor/dashboard/RevenueChart";
import WelcomeBanner from "@/presentation/components/vendor/WelcomeBanner";

import { fetchDashboard } from "@/redux/slices/VendorDashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    dashboard,
    loading,
    error,
  } = useSelector((state) => state.vendorDashboard);


  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);


  return (
    <div className="flex">

      <VendorSidebar />

      <div className="flex-1">

        <VendorNavbar />

        <main className="p-6">

          <h1 className="text-3xl font-bold mb-6">
            Vendor Dashboard
          </h1>


          <WelcomeBanner />


          {error && (
            <p className="mb-4 text-sm text-red-500">
              {error}
            </p>
          )}


          {loading && (
            <p className="mb-4 text-sm text-gray-500">
              Loading dashboard...
            </p>
          )}



          {/* Dashboard Stats */}

          <div className="grid grid-cols-4 gap-4">

            <DashboardCard
              title="Revenue"
              value={`₹${dashboard?.totalRevenue ?? 0}`}
            />


            <DashboardCard
              title="Bookings"
              value={dashboard?.totalBookings ?? 0}
            />


            <DashboardCard
              title="Venues"
              value={dashboard?.totalVenues ?? 0}
            />


            <DashboardCard
              title="Pending"
              value={dashboard?.pendingApprovals ?? 0}
            />

          </div>



          {/* Charts */}

          <div className="grid grid-cols-2 gap-6 mt-8">

            <BookingTrends
              data={dashboard?.bookingTrend || []}
            />


            <RevenueChart
              data={dashboard?.monthlyRevenue || []}
            />

          </div>



          {/* Actions + Recent Bookings */}

          <div className="grid grid-cols-2 gap-6 mt-8">


            <div className="bg-white shadow rounded-lg p-6">

              <QuickActions />

            </div>



            <div className="bg-white shadow rounded-lg p-6">

              <RecentBookings
                bookings={dashboard?.recentBookings || []}
              />

            </div>


          </div>




          {/* Top Venues */}

          <div className="mt-8 bg-white shadow rounded-lg p-6">

            <TopVenues
              venues={dashboard?.topVenues || []}
            />

          </div>


        </main>

      </div>

    </div>
  );
};


export default Dashboard;