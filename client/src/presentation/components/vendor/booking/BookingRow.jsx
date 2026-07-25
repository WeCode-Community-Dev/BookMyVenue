import BookingStatusBadge from "./BookingStatusBadge";
import BookingActions from "./BookingActions";

const BookingRow = ({ booking, onView }) => {
  const customerName =
    booking.customer || booking.user?.fullName || "-";

  const venueName =
    booking.venue || booking.venueId?.name || "-";

  const eventName =
    booking.eventName || booking.eventType || "-";

  const bookingDate =
    booking.bookingDate || booking.date || "-";

  const guests =
    booking.guests || booking.guestCount || "-";

  const amount =
    booking.amount || booking.totalAmount || "-";

  const status = booking.status || "-";

  const bookingId =
    booking.id || booking.bookingId || booking._id || "-";

  const initials = customerName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-6 py-5 font-semibold text-blue-600">
        {bookingId}
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            {initials || "-"}
          </div>

          <div>
            <p className="font-medium">
              {customerName}
            </p>

            <p className="text-xs text-gray-500">
              {guests} guests
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5 text-gray-600">
        {venueName}
      </td>

      <td className="px-6 py-5 text-gray-600">
        {eventName}
      </td>

      <td className="px-6 py-5 font-medium">
        {bookingDate}
      </td>

      <td className="px-6 py-5">
        {guests}
      </td>

      <td className="px-6 py-5 font-semibold">
        {amount}
      </td>

      <td className="px-6 py-5">
        <BookingStatusBadge status={status} />
      </td>

      <td className="px-6 py-5">
        <BookingActions
          status={status}
          bookingId={bookingId}
          onView={onView}
        />
      </td>
    </tr>
  );
};

export default BookingRow;