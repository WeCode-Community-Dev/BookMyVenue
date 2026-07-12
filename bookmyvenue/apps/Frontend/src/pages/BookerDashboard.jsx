import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyBookings } from "../api/bookings";
import { useAuth } from "../context/AuthContext";

function BookerDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError("");
        const data = await getMyBookings(token);
        setBookings(data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadBookings();
    }
  }, [token]);

  function getStatusStyle(status) {
    if (status === "confirmed") {
      return "bg-green-50 text-green-700 border border-green-200";
    }
    if (status === "rejected") {
      return "bg-red-50 text-red-700 border border-red-200";
    }
    return "bg-amber-50 text-amber-700 border border-amber-200";
  }

  function formatStatus(status) {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          <span className="text-sm font-medium">Loading your bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header bar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-extrabold tracking-tight text-red-600"
          >
            BookMyVenue
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-600 hover:text-red-600"
          >
            Browse venues
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            My bookings
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Review and manage all venues you've booked in one place.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Empty state */}
        {bookings.length === 0 && !error && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No bookings yet
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Start exploring and book your ideal venue today.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 rounded-full bg-red-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              Browse venues
            </button>
          </div>
        )}

        {/* Bookings list */}
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-gray-300 hover:shadow-md"
            >
              {/* Top row */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 p-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <span>Booking #{booking.id}</span>
                    <span>•</span>
                    <span>{booking.booking_type}</span>
                  </div>
                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    Venue ID: {booking.venue_id}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Payment status:{" "}
                    <span className="font-semibold text-gray-900">
                      {booking.payment_status}
                    </span>
                  </p>
                </div>

                <span
                  className={`h-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusStyle(
                    booking.status
                  )}`}
                >
                  {formatStatus(booking.status)}
                </span>
              </div>

              {/* Body */}
              <div className="grid gap-6 p-6 md:grid-cols-2">
                {/* Price breakdown */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                    Price breakdown
                  </h3>
                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Base price</span>
                      <span className="font-medium text-gray-900">
                        ₹{booking.base_price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span className="font-medium text-gray-900">
                        ₹{booking.tax_amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform fee</span>
                      <span className="font-medium text-gray-900">
                        ₹{booking.platform_fee}
                      </span>
                    </div>
                    <div className="my-3 border-t border-gray-200" />
                    <div className="flex justify-between text-base">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-extrabold text-red-600">
                        ₹{booking.total_amount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Slots */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                    Slots
                  </h3>
                  {booking.slots?.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {booking.slots.map((slot) => (
                        <span
                          key={slot.id}
                          className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
                        >
                          Availability ID: {slot.availability_id}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">
                      No slots recorded.
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3 text-xs text-gray-500">
                <span>
                  Created on{" "}
                  <span className="font-semibold text-gray-700">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookerDashboard;
