import BookingRow from "./BookingRow";

const BookingTable = ({
  bookings = [],
  loading = false,
  error = "",
  onView,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-center text-gray-500 shadow-sm">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-center text-red-500 shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
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
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-6 text-center text-sm text-gray-500"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <BookingRow
                  key={booking.id || booking._id}
                  booking={booking}
                  onView={onView}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;