import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, IndianRupee, User, MapPin } from "lucide-react";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Loading from "../../components/common/Loading";

import {
  getOwnerBookings,
  updateBookingStatus,
} from "../../api/bookings";

import { useAuth } from "../../context/AuthContext";

function OwnerVenueBookings() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      const data = await getOwnerBookings(token);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id, status) {
    try {
      await updateBookingStatus(id, status, token);
      loadBookings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Unable to update booking.");
    }
  }

  function getStatusStyle(status) {
    if (status === "confirmed") return "bg-green-50 text-green-700 border border-green-200";
    if (status === "rejected") return "bg-red-50 text-red-700 border border-red-200";
    return "bg-amber-50 text-amber-700 border border-amber-200";
  }

  function formatStatus(status) {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  function formatTimeOnly(timeString) {
    if (!timeString) return "";
    return timeString.slice(0, 5);
  }

  if (loading) {
    return <Loading message="Loading bookings..." />;
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8">

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Venue Bookings
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Review, approve or reject booking requests for your venues.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-xl font-bold text-gray-900">No bookings yet</h2>
              <p className="mt-2 text-sm text-gray-600">Bookings will appear here when customers book your venues.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.slice(0, visibleCount).map((booking) => (
                <div
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Top row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-white px-6 py-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold text-gray-900">
                        {booking.venue_name || "Venue #" + booking.venue_id}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {booking.booker_name || "Booker #" + booking.booker_id}
                        </span>
                        <span className="inline-block h-1 w-1 rounded-full bg-gray-400" />
                        <span className="uppercase">{booking.booking_type}</span>
                        <span className="inline-block h-1 w-1 rounded-full bg-gray-400" />
                        <span className="capitalize">{booking.payment_status}</span>
                      </div>
                    </div>
                    <span
                      className={`h-fit rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {formatStatus(booking.status)}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="grid gap-6 p-6 md:grid-cols-2">
                    {/* Left column: price & booking details */}
                    <div className="space-y-4">
                      {/* Price breakdown */}
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700">
                          <IndianRupee size={16} />
                          Price breakdown
                        </h3>
                        <div className="mt-4 space-y-2.5 text-sm text-gray-700">
                          <div className="flex justify-between">
                            <span>Base price</span>
                            <span className="font-medium text-gray-900">&#8377;{booking.base_price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span className="font-medium text-gray-900">&#8377;{booking.tax_amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Platform fee</span>
                            <span className="font-medium text-gray-900">&#8377;{booking.platform_fee}</span>
                          </div>
                          <div className="my-3 border-t border-gray-200" />
                          <div className="flex justify-between text-base">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="font-extrabold text-red-600">&#8377;{booking.total_amount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Created date */}
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Booked on</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {new Date(booking.created_at).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Right column: slots */}
                    <div>
                      <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700">
                          <CalendarDays size={16} />
                          Booked slots
                        </h3>
                        {booking.slots?.length > 0 ? (
                          <div className="mt-4 max-h-[200px] overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {booking.slots.map((slot) => {
                              const slotDate = slot.date ? new Date(slot.date + "T00:00:00") : null;
                              const dayNum = slotDate ? slotDate.toLocaleDateString("en-IN", { day: "numeric" }) : "";
                              const monthStr = slotDate ? slotDate.toLocaleDateString("en-IN", { month: "short" }) : "";
                              const timeDisplay =
                                slot.booking_type === "daily"
                                  ? "Full Day"
                                  : formatTimeOnly(slot.start_time) + " - " + formatTimeOnly(slot.end_time);

                              return (
                                <div
                                  key={slot.id}
                                  className="flex items-start gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                                >
                                  {/* Date badge */}
                                  <div className="flex min-w-[60px] flex-col items-center justify-center rounded-lg bg-red-50 px-3 py-2">
                                    <span className="text-lg font-extrabold leading-none text-red-600">{dayNum}</span>
                                    <span className="mt-0.5 text-xs font-semibold uppercase text-red-500">{monthStr}</span>
                                  </div>

                                  {/* Slot details */}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                      <Clock size={14} className="text-gray-400" />
                                      {timeDisplay}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                      {slot.booking_type === "daily" ? "Full day booking" : "Hourly slot"}
                                    </div>
                                  </div>

                                  {/* Booking type chip */}
                                  <span className="h-fit rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-600">
                                    {slot.booking_type}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="mt-4 text-sm text-gray-500">No slots recorded.</p>
                        )}
                        {booking.slots?.length > 3 && (
                          <p className="mt-3 text-center text-xs font-medium text-gray-400">
                            Scroll for all {booking.slots.length} slots
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons for pending bookings */}
                  {booking.status === "pending" && (
                    <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
                      <button
                        onClick={() => changeStatus(booking.id, "confirmed")}
                        className="rounded-full bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => changeStatus(booking.id, "rejected")}
                        className="rounded-full border border-red-300 bg-white px-6 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Load more */}
          {visibleCount < bookings.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                Load more ({visibleCount} of {bookings.length})
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default OwnerVenueBookings;