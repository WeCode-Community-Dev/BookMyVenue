import React from "react";
import BookingRow from "./BookingRow";

const BookingTable = ({ 
  bookings = [],
   loading = false, 
   error = "",
  onView, }) => {
  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Booking ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Venue</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Event</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Event Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Guests</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="9" className="px-6 py-6 text-sm text-gray-500">No bookings found.</td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <BookingRow 
              key={booking.id || booking._id}
               booking={booking} 
               onView={onView}/>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;