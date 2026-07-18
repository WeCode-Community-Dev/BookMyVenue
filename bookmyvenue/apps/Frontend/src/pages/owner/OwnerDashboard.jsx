import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, IndianRupee, MapPin, Building2, CheckCircle, Hourglass } from "lucide-react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { getMyVenues } from "../../api/venues";
import { getOwnerBookings } from "../../api/bookings";
import { useAuth } from "../../context/AuthContext";

function OwnerDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [stats, setStats] = useState({
    totalVenues: 0,
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    totalRevenue: 0,
    hourlyCount: 0,
    dailyCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [venues, bookings] = await Promise.all([
          getMyVenues(token),
          getOwnerBookings(token),
        ]);

        const totalVenues = venues.length;
        const totalBookings = bookings.length;
        const pending = bookings.filter((b) => b.status === "pending").length;
        const confirmed = bookings.filter((b) => b.status === "confirmed").length;
        const totalRevenue = bookings
          .filter((b) => b.status === "confirmed")
          .reduce((sum, b) => sum + (b.total_amount || 0), 0);
        const hourlyCount = bookings.filter((b) => b.booking_type === "hourly").length;
        const dailyCount = bookings.filter((b) => b.booking_type === "daily").length;

        setStats({
          totalVenues,
          totalBookings,
          pending,
          confirmed,
          totalRevenue,
          hourlyCount,
          dailyCount,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadStats();
    }
  }, [token]);

  const actions = [
    {
      title: "Manage Venues",
      description: "View, edit or delete your venues.",
      path: "/owner/manage-venues",
    },
    {
      title: "Create Venue",
      description: "Add a new venue.",
      path: "/owner/create-venue",
    },
    {
      title: "Manage Bookings",
      description: "Approve or reject customer bookings.",
      path: "/owner/bookings",
    },
  ];

  const statCards = [
    {
      label: "Total Venues",
      value: stats.totalVenues,
      icon: Building2,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarDays,
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Hourglass,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Total Revenue",
      value: "\u20b9" + stats.totalRevenue.toLocaleString("en-IN"),
      icon: IndianRupee,
      color: "bg-red-50 text-red-700",
    },
    {
      label: "Hourly Bookings",
      value: stats.hourlyCount,
      icon: Clock,
      color: "bg-cyan-50 text-cyan-700",
    },
    {
      label: "Daily Bookings",
      value: stats.dailyCount,
      icon: CalendarDays,
      color: "bg-indigo-50 text-indigo-700",
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10">

          <div className="mb-8">
            <h1 className="text-4xl font-bold">
              Owner Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Overview and quick actions for your venues.
            </p>
          </div>

          {/* Stats grid */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {card.label}
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-gray-900">
                      {loading ? "-" : card.value}
                    </p>
                  </div>
                  <div className={"flex h-10 w-10 items-center justify-center rounded-full " + card.color}>
                    <card.icon size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {actions.map((action) => (
              <div
                key={action.title}
                className="rounded-xl bg-white p-6 shadow"
              >
                <h2 className="text-xl font-semibold">
                  {action.title}
                </h2>

                <p className="mt-2 text-gray-500">
                  {action.description}
                </p>

                <button
                  onClick={() => navigate(action.path)}
                  className="mt-6 rounded bg-red-600 px-5 py-2 text-white hover:bg-red-700"
                >
                  Open
                </button>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default OwnerDashboard;




