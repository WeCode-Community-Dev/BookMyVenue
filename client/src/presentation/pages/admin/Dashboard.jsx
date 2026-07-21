import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "@/presentation/components/admin/common/PageHeader";

import DashboardStats from "@/presentation/components/admin/dashboard/DashboardStats";
import BookingOverviewChart from "@/presentation/components/admin/dashboard/BookingOverviewChart";
import RevenueChart from "@/presentation/components/admin/dashboard/RevenueChart";

import { getDashboardStatistics } from "@/redux/slices/AdminDashboardSlice";

const Dashboard = () => {
    const dispatch = useDispatch();

    const {
        statistics,
        loading,
        error,
    } = useSelector((state) => state.adminDashboard);

    useEffect(() => {
        dispatch(getDashboardStatistics());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="text-center py-10">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-10">
                {error}
            </div>
        );
    }

    return (
        <div>

            <PageHeader
                title="Dashboard"
                subtitle="Platform overview and analytics"
            />

            <div className="mb-8">
                <DashboardStats
                    stats={statistics}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <BookingOverviewChart
                    data={statistics.bookingOverview}
                />

                <RevenueChart
                    data={statistics.revenueOverview}
                />

            </div>

        </div>
    );
};

export default Dashboard;

