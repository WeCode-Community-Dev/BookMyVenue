import React from "react";
import BookingStatusBadge from "./BookingStatusBadge";
import BookingActions from "./BookingActions";

const BookingRow = ({ booking }) => {
  const initials = booking.customer
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <tr className="border-b hover:bg-gray-50">

      <td className="px-6 py-5 font-semibold text-blue-600">
        {booking.id}
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">

          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>

          <div>
            <p className="font-medium">
              {booking.customer}
            </p>

            <p className="text-xs text-gray-500">
              {booking.guests} guests
            </p>
          </div>

        </div>
      </td>

      <td className="px-6 py-5 text-gray-600">
        {booking.venue}
      </td>

      <td className="px-6 py-5 text-gray-600">
        {booking.event}
      </td>

      <td className="px-6 py-5 font-medium">
        {booking.date}
      </td>

      <td className="px-6 py-5">
        {booking.guests}
      </td>

      <td className="px-6 py-5 font-semibold">
        {booking.amount}
      </td>

      <td className="px-6 py-5">
        <BookingStatusBadge
          status={booking.status}
        />
      </td>

      <td className="px-6 py-5">
        <BookingActions
          status={booking.status}
        />
      </td>

    </tr>
  );
};

export default BookingRow;