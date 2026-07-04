import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
} from "lucide-react";

function OwnerDashboard() {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customer: "John Mathew",
      venue: "Royal Hall",
      date: "28 Jul 2026",
      status: "Pending",
    },
    {
      id: 2,
      customer: "Anna Joseph",
      venue: "Green Garden",
      date: "30 Jul 2026",
      status: "Accepted",
    },
    {
      id: 3,
      customer: "David Thomas",
      venue: "Lake View",
      date: "2 Aug 2026",
      status: "Rejected",
    },
  ]);

  const updateBookingStatus = (id, status) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === id
          ? { ...booking, status }
          : booking
      )
    );
  };

  const total = bookings.length;
  const accepted = bookings.filter(
    (b) => b.status === "Accepted"
  ).length;
  const pending = bookings.filter(
    (b) => b.status === "Pending"
  ).length;
  const rejected = bookings.filter(
    (b) => b.status === "Rejected"
  ).length;

  return (
    <div className="min-h-screen bg-[#faf7f5] p-8">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#4a1625]">
          Owner Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your venues, bookings and inquiries.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Total Bookings</p>
              <h2 className="text-3xl font-bold text-blue-600 mt-2">
                {total}
              </h2>
            </div>

            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="text-blue-600" size={28} />
            </div>
          </div>
        </div>

        {/* Accepted */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Accepted</p>
              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {accepted}
              </h2>
            </div>

            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="text-green-600" size={28} />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Pending</p>
              <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                {pending}
              </h2>
            </div>

            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="text-yellow-600" size={28} />
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-red-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Rejected</p>
              <h2 className="text-3xl font-bold text-red-600 mt-2">
                {rejected}
              </h2>
            </div>

            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="text-red-600" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-md mt-10 p-6">
        <h2 className="text-2xl font-semibold text-[#4a1625] mb-6">
          Recent Booking Requests
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-gray-600">
                <th className="py-3">Customer</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-4">{booking.customer}</td>
                  <td>{booking.venue}</td>
                  <td>{booking.date}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === "Accepted"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td>
                    {booking.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "Accepted"
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "Rejected"
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                        onClick={() =>
                          alert(
                            `Booking Details\n\nCustomer: ${booking.customer}\nVenue: ${booking.venue}\nDate: ${booking.date}\nStatus: ${booking.status}`
                          )
                        }
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;