import { useState } from "react";
import { Link } from "react-router-dom";
import { checkBookingInquiryStatus, cancelBookingInquiry } from "../services/bookingInquiryService";
import { usePageTitle } from "../hooks/usePageTitle";
export default function CheckStatus() {
  usePageTitle("Check Booking Status");
  const [formData, setFormData] = useState({
    trackingCode: "",
    customerPhone: "",
  });

  const [booking, setBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false)

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-200 text-gray-700",
  };

  const formatStatus = (status = "") => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelInquiry = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelInquiry = async () => {
    try {
      setCancelLoading(true);
      setError("");

      const result = await cancelBookingInquiry({
        trackingCode: booking.trackingCode,
        customerPhone: booking.customerPhone,
      });

      setBooking(result.data);
      setShowCancelConfirm(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to cancel booking inquiry"
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.trackingCode.trim() || !formData.customerPhone.trim()) {
      setError("Tracking code and phone number are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setBooking(null);

      const result = await checkBookingInquiryStatus({
        trackingCode: formData.trackingCode.trim().toUpperCase(),
        customerPhone: formData.customerPhone.trim(),
      });

      setBooking(result.data);
      setShowModal(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to find booking inquiry. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-[#8b1e2d]">
          Check Booking Status
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Enter your tracking code and phone number to track your booking
          request.
        </p>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Tracking Code
            </label>

            <input
              type="text"
              name="trackingCode"
              value={formData.trackingCode}
              onChange={handleChange}
              placeholder="Example: BMV-A7K92Q"
              className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Phone Number
            </label>

            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              placeholder="Example: 9876543210"
              className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8b1e2d] text-white py-4 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Checking Status..." : "Check Status"}
          </button>
        </form>
      </div>

      {showModal && booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-[#8b1e2d]">
              Booking Status
            </h2>

            <p className="text-gray-500 mt-2">
              Latest status of your booking inquiry.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="font-medium text-gray-600">
                  Tracking Code
                </span>
                <span className="font-semibold text-right">
                  {booking.trackingCode}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="font-medium text-gray-600">Customer</span>
                <span className="text-right">{booking.customerName}</span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="font-medium text-gray-600">Phone</span>
                <span className="text-right">{booking.customerPhone}</span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="font-medium text-gray-600">Email</span>
                <span className="text-right">
                  {booking.customerEmail || "Not provided"}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="font-medium text-gray-600">Venue</span>
                <span className="text-right">
                  {booking.venue?.name || "Venue unavailable"}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="font-medium text-gray-600">Location</span>
                <span className="text-right">
                  {booking.venue?.town}, {booking.venue?.district}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="font-medium text-gray-600">Event Date</span>
                <span className="text-right">{booking.eventDate}</span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="font-medium text-gray-600">Guests</span>
                <span className="text-right">{booking.guestCount}</span>
              </div>

              <div className="flex justify-between gap-4 border-b pb-3">
                <span className="font-medium text-gray-600">Message</span>
                <span className="text-right max-w-md">
                  {booking.message || "No message provided"}
                </span>
              </div>

              <div className="flex justify-between items-center gap-4">
                <span className="font-medium text-gray-600">Status</span>

                <span
                  className={`px-4 py-2 rounded-full font-semibold ${statusStyles[booking.status]
                    }`}
                >
                  {formatStatus(booking.status)}
                </span>
              </div>
            </div>

            <div className="mt-8">
              {booking.status === "pending" && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
                  <h3 className="font-semibold text-yellow-700">
                    Booking Under Review
                  </h3>

                  <p className="text-gray-600 mt-2">
                    Your booking request has been sent to the venue owner.
                    Please wait while they review your request.
                  </p>
                </div>
              )}

              {booking.status === "pending" && (
                <button
                  type="button"
                  onClick={handleCancelInquiry}
                  disabled={cancelLoading}
                  className="mt-4 w-full border border-red-600 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel Inquiry
                </button>
              )}

              {booking.status === "accepted" && (
                <div className="bg-green-50 border border-green-300 rounded-xl p-4">
                  <h3 className="font-semibold text-green-700">
                    Booking Accepted 🎉
                  </h3>

                  <p className="text-gray-600 mt-2">
                    Your booking inquiry has been accepted by the venue owner.
                    The owner may contact you using the phone number or email
                    you provided.
                  </p>
                </div>
              )}

              {booking.status === "cancelled" && (
                <div className="bg-gray-50 border border-gray-300 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-700">
                    Booking Inquiry Cancelled
                  </h3>

                  <p className="text-gray-600 mt-2">
                    You cancelled this booking inquiry. The venue owner can no longer accept
                    or reject this request.
                  </p>

                  <Link
                    to="/venues"
                    className="inline-block mt-4 bg-[#8b1e2d] text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Browse Other Venues
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-10">
              <h3 className="font-semibold text-lg mb-4">
                Booking Progress
              </h3>

              <div className="space-y-3">
                <div className="text-green-600">
                  ✔ Booking Request Submitted
                </div>

                <div
                  className={
                    booking.status === "pending"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                >
                  {booking.status === "pending"
                    ? "⏳ Venue Owner Review"
                    : "✔ Venue Owner Review"}
                </div>

                <div
                  className={
                    booking.status === "accepted"
                      ? "text-green-600"
                      : booking.status === "rejected"
                        ? "text-red-600"
                        : booking.status === "cancelled"
                          ? "text-gray-600"
                          : "text-gray-400"
                  }
                >
                  {booking.status === "pending"
                    ? "○ Final Decision"
                    : booking.status === "accepted"
                      ? "✔ Booking Accepted"
                      : booking.status === "rejected"
                        ? "✖ Booking Rejected"
                        : "✖ Inquiry Cancelled"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="mt-8 w-full border border-[#8b1e2d] text-[#8b1e2d] py-3 rounded-xl font-semibold hover:bg-red-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              if (!cancelLoading) {
                setShowCancelConfirm(false);
              }
            }}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto">
              !
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mt-5">
              Cancel Booking Inquiry?
            </h2>

            <p className="text-gray-600 text-center mt-3 leading-6">
              Are you sure you want to cancel this booking inquiry? Once cancelled,
              the venue owner cannot accept this request.
            </p>

            <div className="mt-5 bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Tracking Code:</span>{" "}
                {booking?.trackingCode}
              </p>

              <p className="mt-1">
                <span className="font-semibold">Venue:</span>{" "}
                {booking?.venue?.name || "Venue unavailable"}
              </p>

              <p className="mt-1">
                <span className="font-semibold">Event Date:</span>{" "}
                {booking?.eventDate}
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                disabled={cancelLoading}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-60"
              >
                Keep Inquiry
              </button>

              <button
                type="button"
                onClick={confirmCancelInquiry}
                disabled={cancelLoading}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}