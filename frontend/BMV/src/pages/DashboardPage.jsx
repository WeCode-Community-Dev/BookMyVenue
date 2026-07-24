import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUserAsync, fetchCurrentUserAsync } from "../modules/auth/authSlice";
import { fetchMyBookingsAsync } from "../modules/bookings/bookingSlice";
import { getVenues } from "../modules/venues/services/venueService";
import VenueCard from "../components/VenueCard";

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const { list: bookings, loading: bookingsLoading } = useSelector((state) => state.bookings);
  const dispatch = useDispatch();

  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [venuesError, setVenuesError] = useState("");

  useEffect(() => {
    dispatch(fetchMyBookingsAsync({ limit: 3 }));
  }, [dispatch]);

  const loadVenues = async () => {
    setVenuesLoading(true);
    setVenuesError("");
    try {
      const data = await getVenues({ search, location, limit: 50 });
      setVenues(data);
    } catch (err) {
      setVenuesError(err.message || "Failed to load venues");
    } finally {
      setVenuesLoading(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, []);

  const recentBookings = Array.isArray(bookings) ? bookings.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">BookMyVenue</h1>
            <p className="text-sm text-slate-400">
              {user?.name ? `Welcome, ${user.name}` : "Welcome back"}
            </p>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/profile" className="text-slate-600 hover:text-blue-600">
              Profile
            </Link>
            <Link to="/order-history" className="text-slate-600 hover:text-blue-600">
              Orders
            </Link>
            <button
              type="button"
              onClick={() => dispatch(logoutUserAsync())}
              className="text-slate-500 hover:text-rose-600"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/profile"
            className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-blue-100 transition-all"
          >
            <p className="text-xs text-slate-400 uppercase tracking-wide">Profile</p>
            <p className="font-semibold text-slate-800 mt-1">{user?.name || "Your account"}</p>
            <p className="text-sm text-slate-400 mt-1 truncate">{user?.email}</p>
            <p className="text-xs text-blue-600 mt-3">View & edit →</p>
          </Link>

          <Link
            to="/order-history"
            className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-blue-100 transition-all md:col-span-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Order history</p>
                <p className="font-semibold text-slate-800 mt-1">Your bookings</p>
              </div>
              <span className="text-xs text-blue-600">View all →</span>
            </div>
            {bookingsLoading ? (
              <p className="text-sm text-slate-400 mt-4">Loading...</p>
            ) : recentBookings.length === 0 ? (
              <p className="text-sm text-slate-400 mt-4">No bookings yet.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {recentBookings.map((b) => (
                  <li key={b.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      Booking #{b.id} · {String(b.booking_date)}
                    </span>
                    <span className="text-slate-400 capitalize">{b.status?.replace("_", " ")}</span>
                  </li>
                ))}
              </ul>
            )}
          </Link>
        </section>

        <section>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">All venues</h2>
              <p className="text-sm text-slate-400">Browse and book approved venues</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadVenues();
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                placeholder="Search name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
              >
                Search
              </button>
            </form>
          </div>

          {venuesLoading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {venuesError && (
            <p className="text-rose-600 text-sm bg-rose-50 px-4 py-3 rounded-xl">{venuesError}</p>
          )}
          {!venuesLoading && !venuesError && venues.length === 0 && (
            <p className="text-center text-slate-400 py-12">No venues found.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
