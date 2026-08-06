import DashboardStatCard from "../../components/venueOwner/DashboardStatCard.jsx";
import QuickAccessCard from "../../components/venueOwner/QuickAccessCard.jsx";
import RecentActivities from "../../components/venueOwner/RecentActivities.jsx";
import { Building2, Clock3, FileText, Ban, Plus, CalendarDays,BarChart3,Settings } from "lucide-react";

export function VenueOwnerDashboard() {
  return (
    <div className="space-y-10">

      {/* Page Heading */}
      <section>
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
      </section>

      {/* Statistics Cards */}
      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            icon={Building2}
            title="Active Venues"
            value={12}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />

          <DashboardStatCard
            icon={Clock3}
            title="Pending Approval"
            value={3}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-600"
          />

          <DashboardStatCard
            icon={FileText}
            title="Draft Venues"
            value={2}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <DashboardStatCard
            icon={Ban}
            title="Disabled"
            value={1}
            iconBg="bg-gray-100"
            iconColor="text-gray-600"
          />
        </div>
      </section>

      {/* Quick Access */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Access
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Quick Action Cards */}

          <QuickAccessCard
            icon={Plus}
            title="Add Venue"
            bgColor="bg-red-50"
            iconColor="text-red-600"
          />

          <QuickAccessCard
            icon={CalendarDays}
            title="Bookings"
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />

          <QuickAccessCard
            icon={BarChart3}
            title="Analytics"
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />

          <QuickAccessCard
            icon={Settings}
            title="Settings"
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Activity
        </h2>

        <div>
          {/* Activity List */}
          <RecentActivities/>

        </div>
      </section>

    </div>
  )
}