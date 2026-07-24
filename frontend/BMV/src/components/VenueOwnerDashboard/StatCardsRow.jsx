import { Link } from "react-router-dom";
import { Building2, CalendarCheck, CalendarClock, IndianRupee, TrendingUp } from "lucide-react";

function StatCard({ icon: Icon, iconBg, iconColor, label, value, footer, footerColor, to }) {
  const content = (
    <>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
      {footer && (
        <p className={`text-xs font-medium flex items-center gap-1 ${footerColor || "text-gray-400"}`}>
          {footer}
        </p>
      )}
    </>
  );

  const className =
    "bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:border-rose-200 hover:shadow-md transition-all";

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

function StatCardsRow({ summary, loading }) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-2xl p-5 h-[120px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Building2}
        iconBg="bg-rose-50"
        iconColor="text-rose-700"
        label="TOTAL VENUES"
        value={summary.total_venues}
        footer={`${summary.active_venues} Active • ${summary.pending_venues} Pending`}
        footerColor="text-emerald-600"
        to="/owner/venues"
      />
      <StatCard
        icon={CalendarCheck}
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
        label="BOOKING REQUESTS"
        value={summary.booking_requests_total}
        footer={`${summary.booking_requests_new} New • ${summary.booking_requests_pending} Pending`}
        footerColor="text-amber-600"
        to="/owner/bookings"
      />
      <StatCard
        icon={CalendarClock}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
        label="UPCOMING EVENTS"
        value={summary.upcoming_events_count}
        footer={
          summary.next_event_date
            ? `Next: ${new Date(summary.next_event_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}`
            : "No upcoming events"
        }
        footerColor="text-blue-600"
        to="/owner/bookings"
      />
      <StatCard
        icon={IndianRupee}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        label="MONTHLY REVENUE"
        value={`₹${summary.monthly_revenue.toLocaleString("en-IN")}`}
        footer={
          <>
            <TrendingUp size={13} /> {summary.monthly_revenue_change_pct}% vs last month
          </>
        }
        footerColor="text-emerald-600"
        to="/owner/revenue"
      />
    </div>
  );
}

export default StatCardsRow;
