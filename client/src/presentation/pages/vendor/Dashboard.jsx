import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
import DashboardCard from "@/presentation/components/vendor/dashboard/DashboardCard";
import RecentBookings from "@/presentation/components/vendor/dashboard/RecentBookings";
import TopVenues from "@/presentation/components/vendor/dashboard/TopVenues";
import BookingTrends from "@/presentation/components/vendor/dashboard/BookingTrends";
import RevenueChart from "@/presentation/components/vendor/dashboard/RevenueChart";
import WelcomeBanner from "@/presentation/components/vendor/dashboard/WelcomeBanner";

import { fetchDashboard } from "@/redux/slices/VendorDashboardSlice";

import {
  IndianRupee,
  CalendarDays,
  Building2,
  Clock3,
} from "lucide-react";

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
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <VendorSidebar />

      {/* Main Content */}
      <div className="flex-1">

        {/* Navbar */}
        <VendorNavbar />

        <main className="min-h-screen bg-gray-100 p-6">

          {/* Page Title */}
          <h1 className="text-3xl font-bold mb-6">
            Vendor Dashboard
          </h1>

          {/* Welcome Banner */}
          <div className="mb-6">
            <WelcomeBanner
              dashboard={dashboard}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <p className="mb-4 text-sm text-gray-500">
              Loading dashboard...
            </p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">

            <DashboardCard
              title="Revenue"
              value={`₹${dashboard?.totalRevenue ?? 0}`}
              icon={IndianRupee}
              color="text-emerald-600"
            />

            <DashboardCard
              title="Bookings"
              value={dashboard?.totalBookings ?? 0}
              icon={CalendarDays}
              color="text-orange-600"
            />

            <DashboardCard
              title="Venues"
              value={dashboard?.totalVenues ?? 0}
              icon={Building2}
              color="text-purple-600"
            />

            <DashboardCard
              title="Pending"
              value={dashboard?.pendingApprovals ?? 0}
              icon={Clock3}
              color="text-yellow-600"
            />

          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

            <BookingTrends
              data={dashboard?.bookingTrend || []}
            />

            <RevenueChart
              data={dashboard?.monthlyRevenue || []}
            />

          </div>

          {/* Actions + Bookings */}


            <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
              <RecentBookings
                bookings={dashboard?.recentBookings || []}
              />
            </div>


          {/* Top Venues */}
          <div className="mt-8 bg-white shadow-sm border border-gray-200 rounded-xl p-6">
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