import { Wallet, TrendingUp, Building2, CalendarCheck } from "lucide-react";
import { StatCard } from "../../components/venueOwner/StatCard";
import { RevenueTrendChart } from "../../components/venueOwner/RevenueTrendChart";
import { VenueRevenueTable } from "../../components/venueOwner/VenueRevenueTable";
import { CategoryBreakdown } from "../../components/venueOwner/CategoryBreakdown";
import { getTotalRevenue, getTotalBookings, getMostProfitable, getAvgBookingValue, getRevenueByCategory} from "../../utils/ownerPageUtils";

const VENUE_REVENUE = [
  { id: "v1", name: "Royal Grand Hall", category: "Banquet Hall", bookings: 18, revenue: 845000, trend: 12.4 },
  { id: "v2", name: "Backwater Resort", category: "Resort", bookings: 9, revenue: 1120000, trend: 8.1 },
  { id: "v3", name: "The Garden Café", category: "Café", bookings: 32, revenue: 312000, trend: -4.2 },
  { id: "v4", name: "Skyline Auditorium", category: "Auditorium", bookings: 6, revenue: 690000, trend: 21.7 },
];

const MONTHLY_TREND = [
  { month: "Jan", value: 210000 },
  { month: "Feb", value: 245000 },
  { month: "Mar", value: 198000 },
  { month: "Apr", value: 287000 },
  { month: "May", value: 320000 },
  { month: "Jun", value: 365000 },
];

const totalRevenue = getTotalRevenue(VENUE_REVENUE);
const totalBookings = getTotalBookings(VENUE_REVENUE);
const mostProfitable = getMostProfitable(VENUE_REVENUE);
const avgBookingValue = getAvgBookingValue(VENUE_REVENUE);
const revenueByCategory = getRevenueByCategory(VENUE_REVENUE);

export function VenueOwnerAnalytics() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      </section>

      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Wallet}
            title="Total Revenue"
            value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
            sub="All venues, all time"
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Most Profitable Venue"
            value={mostProfitable.name}
            sub={`₹${mostProfitable.revenue.toLocaleString()} earned`}
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />
          <StatCard
            icon={CalendarCheck}
            title="Total Bookings"
            value={totalBookings}
            sub="Across all venues"
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={Building2}
            title="Avg. Booking Value"
            value={`₹${avgBookingValue.toLocaleString()}`}
            sub="Per confirmed booking"
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>
      </section>


      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <RevenueTrendChart monthlyTrend={MONTHLY_TREND} />
        <CategoryBreakdown entries={revenueByCategory} totalRevenue={totalRevenue} />
      </section>

      <section>
        <VenueRevenueTable venueRevenue={VENUE_REVENUE} />
      </section>
    </div>
  );
}