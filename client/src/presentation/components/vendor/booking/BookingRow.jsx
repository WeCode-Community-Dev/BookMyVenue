import React from "react";
import BookingStatusBadge from "./BookingStatusBadge";
import BookingActions from "./BookingActions";

const BookingRow = ({ booking,onView }) => {
  const customerName = booking.customer || booking.user?.fullName || "-";
  const venueName = booking.venue || booking.venueId?.name || "-";
  const eventName = booking.eventName || booking.eventType || "-";
  const bookingDate = booking.bookingDate || booking.date || "-";
  const guests = booking.guests || booking.guestCount || "-";
  const amount = booking.amount || booking.totalAmount || "-";
  const status = booking.status || "-";

  const initials = customerName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-6 py-5 font-semibold text-blue-600">{booking.id || booking.bookingId || "-"}</td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
            {initials || "-"}
          </div>

          <div>
            <p className="font-medium">{customerName}</p>
            <p className="text-xs text-gray-500">{guests} guests</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5 text-gray-600">{venueName}</td>
      <td className="px-6 py-5 text-gray-600">{eventName}</td>
      <td className="px-6 py-5 font-medium">{bookingDate}</td>
      <td className="px-6 py-5">{guests}</td>
      <td className="px-6 py-5 font-semibold">{amount}</td>
      <td className="px-6 py-5"><BookingStatusBadge status={status} /></td>
      <td className="px-6 py-5"><BookingActions 
      status={booking.status} 
      bookingId={booking.id ||booking._id}
      onView={onView}
                /></td>
    </tr>
  );
};

export default BookingRow;