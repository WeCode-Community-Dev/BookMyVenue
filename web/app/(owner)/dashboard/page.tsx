import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardStatCards } from "@/components/dashboard/dashboard-stat-cards";
import { MapWidget } from "@/components/dashboard/map-widget";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UpcomingBookingsTable } from "@/components/dashboard/upcoming-bookings-table";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <DashboardPageHeader />
      <DashboardStatCards />
      <UpcomingBookingsTable />
      {/* <div className="grid gap-6 lg:grid-cols-2">
        <MapWidget />
        <RecentActivity />
      </div> */}
    </div>
  );
}
