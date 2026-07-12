import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  X,
  Phone,
  Mail,
  Users,
  MapPin,
  MessageSquare,
  Building2,
  IndianRupee,
} from "lucide-react";

import {
  getOwnerBookingInquiries,
  updateBookingInquiryStatus,
} from "../services/bookingInquiryService.js";

import { usePageTitle } from "../hooks/usePageTitle.js";

function OwnerDashboard() {
  usePageTitle("Owner Dashboard")
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        const result = await getOwnerBookingInquiries();

        if (isMounted) {
          setBookings(result.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message || "Failed to fetch booking inquiries"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateBookingStatus = async (id, status) => {
    try {
      setActionLoadingId(id);
      setError("");

      const result = await updateBookingInquiryStatus(id, status);

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === id ? result.data : booking
        )
      );

      setSelectedBooking((prev) =>
        prev && prev._id === id ? result.data : prev
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update booking status"
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const stats = useMemo(() => {
    const total = bookings.length;
    const accepted = bookings.filter((b) => b.status === "accepted").length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const rejected = bookings.filter((b) => b.status === "rejected").length;

    return {
      total,
      accepted,
      pending,
      rejected,
    };
  }, [bookings]);

  const formatStatus = (status = "") => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusClass = (status) => {
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    if (status === "cancelled") return "bg-gray-200 text-gray-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const formatPricingModel = (pricingModel = "") => {
    return pricingModel.replace("per_", "Per ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f5] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading owner dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f5] p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#4a1625]">
            Owner Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your venues, bookings and inquiries.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/owner/venues"
            className="px-6 py-3 rounded-xl border border-[#8b1e2d] text-[#8b1e2d] font-medium hover:bg-red-50 transition"
          >
            My Venues
          </Link>

          <Link
            to="/owner/venues/new"
            className="px-6 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#8b1e2d] to-[#4a1625] hover:shadow-lg transition"
          >
            + Submit Venue
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Total Inquiries</p>
              <h2 className="text-3xl font-bold text-blue-600 mt-2">
                {stats.total}
              </h2>
            </div>

            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Accepted</p>
              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {stats.accepted}
              </h2>
            </div>

            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="text-green-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Pending</p>
              <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.pending}
              </h2>
            </div>

            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="text-yellow-600" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-red-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Rejected</p>
              <h2 className="text-3xl font-bold text-red-600 mt-2">
                {stats.rejected}
              </h2>
            </div>

            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="text-red-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md mt-10 p-6">
        <h2 className="text-2xl font-semibold text-[#4a1625] mb-6">
          Booking Inquiry Requests
        </h2>

        {bookings.length === 0 ? (
          <p className="text-gray-500">No booking inquiries found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-gray-600">
                  <th className="py-3">Customer</th>
                  <th>Venue</th>
                  <th>Event Date</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.customerName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.customerPhone}
                        </p>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            booking.venue?.images?.[0] ||
                            "/placeholder-venue.jpg"
                          }
                          alt={booking.venue?.name || "Venue"}
                          className="w-12 h-12 rounded-xl object-cover"
                        />

                        <div>
                          <p className="font-medium">
                            {booking.venue?.name || "Venue unavailable"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.venue?.town}, {booking.venue?.district}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>{booking.eventDate}</td>

                    <td>{booking.guestCount}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {formatStatus(booking.status)}
                      </span>
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
                        >
                          View
                        </button>

                        {booking.status === "pending" && (
                          <>
                            <button
                              disabled={actionLoadingId === booking._id}
                              onClick={() =>
                                updateBookingStatus(
                                  booking._id,
                                  "accepted"
                                )
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-60"
                            >
                              Accept
                            </button>

                            <button
                              disabled={actionLoadingId === booking._id}
                              onClick={() =>
                                updateBookingStatus(
                                  booking._id,
                                  "rejected"
                                )
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow"
            >
              <X size={22} />
            </button>

            <div className="relative">
              <img
                src={
                  selectedBooking.venue?.images?.[0] ||
                  "/placeholder-venue.jpg"
                }
                alt={selectedBooking.venue?.name || "Venue"}
                className="w-full h-80 object-cover rounded-t-3xl"
              />

              <div className="absolute inset-0 bg-black/40 rounded-t-3xl flex items-end">
                <div className="p-8 text-white">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-800`}
                  >
                    {formatStatus(selectedBooking.status)}
                  </span>

                  <h2 className="text-4xl font-bold mt-4">
                    Booking Inquiry
                  </h2>

                  <p className="mt-2">
                    For {selectedBooking.venue?.name || "Venue unavailable"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-[#4a1625] mb-4">
                    Customer Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#faf7f5] rounded-2xl p-5">
                      <p className="text-sm text-gray-500">Customer Name</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {selectedBooking.customerName}
                      </p>
                    </div>

                    <div className="bg-[#faf7f5] rounded-2xl p-5">
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                        <Phone size={16} />
                        {selectedBooking.customerPhone}
                      </p>
                    </div>

                    <div className="bg-[#faf7f5] rounded-2xl p-5">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2 break-all">
                        <Mail size={16} />
                        {selectedBooking.customerEmail || "Not provided"}
                      </p>
                    </div>

                    <div className="bg-[#faf7f5] rounded-2xl p-5">
                      <p className="text-sm text-gray-500">Logged-in User</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {selectedBooking.user?.name || "Guest Inquiry"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#4a1625] mb-4">
                    Event Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#faf7f5] rounded-2xl p-5">
                      <p className="text-sm text-gray-500">Event Date</p>
                      <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                        <Calendar size={16} />
                        {selectedBooking.eventDate}
                      </p>
                    </div>

                    <div className="bg-[#faf7f5] rounded-2xl p-5">
                      <p className="text-sm text-gray-500">Guest Count</p>
                      <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                        <Users size={16} />
                        {selectedBooking.guestCount} guests
                      </p>
                    </div>

                    <div className="bg-[#faf7f5] rounded-2xl p-5 md:col-span-2">
                      <p className="text-sm text-gray-500">Message</p>
                      <p className="font-semibold text-gray-900 mt-2 flex gap-2 leading-7">
                        <MessageSquare size={18} className="mt-1 shrink-0" />
                        {selectedBooking.message || "No message provided."}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#4a1625] mb-4">
                    Venue Details
                  </h3>

                  <div className="bg-[#faf7f5] rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <Building2 className="text-[#8b1e2d] mt-1" />

                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          {selectedBooking.venue?.name || "Venue unavailable"}
                        </h4>

                        <p className="text-gray-600 mt-2">
                          {selectedBooking.venue?.description ||
                            "No venue description available."}
                        </p>

                        <p className="text-gray-600 mt-3 flex items-center gap-2">
                          <MapPin size={16} />
                          {selectedBooking.venue?.address ||
                            `${selectedBooking.venue?.town}, ${selectedBooking.venue?.district}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBooking.venue?.amenities?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-[#4a1625] mb-4">
                      Venue Amenities
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {selectedBooking.venue.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="bg-[#faf7f5] rounded-2xl p-5">
                  <h3 className="font-bold text-[#4a1625] mb-4">
                    Inquiry Summary
                  </h3>

                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Status:</strong>{" "}
                      {formatStatus(selectedBooking.status)}
                    </p>

                    <p>
                      <strong>Submitted On:</strong>{" "}
                      {new Date(selectedBooking.createdAt).toLocaleDateString()}
                    </p>

                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {new Date(selectedBooking.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-[#faf7f5] rounded-2xl p-5">
                  <h3 className="font-bold text-[#4a1625] mb-4">
                    Venue Summary
                  </h3>

                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Category:</strong>{" "}
                      {selectedBooking.venue?.category || "N/A"}
                    </p>

                    <p>
                      <strong>Capacity:</strong> Up to{" "}
                      {selectedBooking.venue?.capacity || "N/A"} guests
                    </p>

                    <p className="flex items-center gap-2">
                      <IndianRupee size={16} />
                      <span>
                        <strong>Starting Price:</strong>{" "}
                        ₹{selectedBooking.venue?.pricing?.basePrice || "N/A"}
                      </span>
                    </p>

                    <p>
                      <strong>Pricing Model:</strong>{" "}
                      {formatPricingModel(
                        selectedBooking.venue?.pricing?.pricingModel ||
                        "per_day"
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-[#faf7f5] rounded-2xl p-5">
                  <h3 className="font-bold text-[#4a1625] mb-4">
                    Venue Contact
                  </h3>

                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-center gap-2">
                      <Phone size={16} />
                      {selectedBooking.venue?.contactInfo?.phone ||
                        "Not provided"}
                    </p>

                    <p className="flex items-center gap-2 break-all">
                      <Mail size={16} />
                      {selectedBooking.venue?.contactInfo?.email ||
                        "Not provided"}
                    </p>
                  </div>
                </div>

                {selectedBooking.status === "pending" && (
                  <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={
                      actionLoadingId === selectedBooking._id ||
                      selectedBooking.status === "accepted"
                    }
                    onClick={() =>
                      updateBookingStatus(selectedBooking._id, "accepted")
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    disabled={
                      actionLoadingId === selectedBooking._id ||
                      selectedBooking.status === "rejected"
                    }
                    onClick={() =>
                      updateBookingStatus(selectedBooking._id, "rejected")
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                </div>
              )}

                {selectedBooking.status === "accepted" && (
                  <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
                    This inquiry is accepted. The venue will be treated as
                    booked for this event date.
                  </p>
                )}

                {selectedBooking.status === "rejected" && (
                  <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                    This inquiry has been rejected.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;