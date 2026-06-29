import React from "react";
import BookingRow from "./BookingRow";

const bookings = [
  {
    id: "BK-1042",
    customer: "Priya Mehta",
    venue: "Grand Ballroom",
    event: "Wedding Reception",
    date: "Jun 14, 2025",
    guests: 350,
    amount: "₹1,20,000",
    status: "Confirmed",
  },
  {
    id: "BK-1041",
    customer: "Rahul Sharma",
    venue: "Skyline Terrace",
    event: "Corporate Event",
    date: "Jun 18, 2025",
    guests: 80,
    amount: "₹85,000",
    status: "Pending",
  },
  {
    id: "BK-1040",
    customer: "Sneha Patel",
    venue: "Garden Grove",
    event: "Birthday Party",
    date: "Jun 20, 2025",
    guests: 120,
    amount: "₹32,000",
    status: "Confirmed",
  },
];

const BookingTable = () => {
  return (
<div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full">

<thead className="bg-gray-50 border-b">
  <tr>
    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
      Booking ID
    </th>

    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
      Customer
    </th>

    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
      Venue
    </th>

    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
      Event
    </th>

    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
      Event Date
    </th>

    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
      Guests
    </th>

    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
      Amount
    </th>

    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
      Status
    </th>

    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
      Actions
    </th>
  </tr>
</thead>        <tbody>

          {bookings.map((booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
            />
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default BookingTable;