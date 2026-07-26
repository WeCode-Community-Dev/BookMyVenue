import BookingRow from "./BookingRow";

const BookingTable = ({
  bookings = [],
  loading,
  error,
  onView,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">
          Loading bookings...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">
          No bookings found
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="px-4 py-4 text-sm font-semibold text-gray-700">
              Booking ID
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-gray-700">
              Customer
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-gray-700">
              Venue
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-gray-700">
              Event Date
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-gray-700">
              Total
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-gray-700">
              Status
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-gray-700">
              Payment
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <BookingRow
              key={booking.id || booking._id}
              booking={booking}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;