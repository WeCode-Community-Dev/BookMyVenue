import React, { useState } from "react";

const bookingData = {
  bookingId: "BK1024",
  venue: "Royal Convention Hall",
  event: "Wedding",
  date: "20 July 2026",
  guests: 250,
  status: "Accepted", // Pending | Accepted | Rejected
  reason: "The venue is already booked on your selected date.",
};

export default function CheckStatus() {
  const [booking] = useState(bookingData);

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Accepted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-[#8b1e2d]">
          Check Booking Status
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Track the latest status of your booking request.
        </p>

        {/* Booking Details */}
        <div className="mt-8 space-y-4">
          <div className="flex justify-between border-b pb-3">
            <span className="font-medium text-gray-600">Booking ID</span>
            <span>{booking.bookingId}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="font-medium text-gray-600">Venue</span>
            <span>{booking.venue}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="font-medium text-gray-600">Event</span>
            <span>{booking.event}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="font-medium text-gray-600">Booking Date</span>
            <span>{booking.date}</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span className="font-medium text-gray-600">Guests</span>
            <span>{booking.guests}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Status</span>

            <span
              className={`px-4 py-2 rounded-full font-semibold ${
                statusStyles[booking.status]
              }`}
            >
              {booking.status}
            </span>
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-8">
          {booking.status === "Pending" && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
              <h2 className="font-semibold text-yellow-700">
                Booking Under Review
              </h2>
              <p className="text-gray-600 mt-2">
                Your booking request has been sent to the venue owner. Please
                wait while they review your request.
              </p>
            </div>
          )}

          {booking.status === "Accepted" && (
            <div className="bg-green-50 border border-green-300 rounded-xl p-4">
              <h2 className="font-semibold text-green-700">
                Booking Accepted 🎉
              </h2>
              <p className="text-gray-600 mt-2">
                Congratulations! Your booking has been accepted by the venue
                owner.
              </p>

              <button className="mt-4 bg-[#8b1e2d] text-white px-5 py-2 rounded-lg hover:bg-red-700 transition">
                Proceed to Payment
              </button>
            </div>
          )}

          {booking.status === "Rejected" && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-4">
              <h2 className="font-semibold text-red-700">
                Booking Rejected
              </h2>

              <p className="text-gray-600 mt-2">
                Unfortunately, your booking request was rejected.
              </p>

              <p className="mt-3">
                <span className="font-semibold">Reason:</span>{" "}
                {booking.reason}
              </p>

              <button className="mt-4 bg-[#8b1e2d] text-white px-5 py-2 rounded-lg hover:bg-red-700 transition">
                Browse Other Venues
              </button>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="mt-10">
          <h2 className="font-semibold text-lg mb-4">Booking Progress</h2>

          <div className="space-y-3">
            <div className="text-green-600">✔ Booking Request Submitted</div>
            <div className="text-green-600">✔ Venue Owner Review</div>

            <div
              className={
                booking.status === "Accepted"
                  ? "text-green-600"
                  : booking.status === "Rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }
            >
              {booking.status === "Pending"
                ? "⏳ Waiting for Approval"
                : booking.status === "Accepted"
                ? "✔ Booking Accepted"
                : "✖ Booking Rejected"}
            </div>

            <div className="text-gray-400">○ Payment</div>
          </div>
        </div>
      </div>
    </div>
  );
}