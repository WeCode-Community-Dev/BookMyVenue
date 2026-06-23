import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyBookingsAsync } from "../modules/bookings/bookingSlice";

const STATUS_BADGE = {
  pending_payment: "bg-amber-100 text-amber-800",
  booked: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function StatusBadge({ status }) {
  const cls = STATUS_BADGE[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

function MyBookingsPage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.bookings);
  const bookings = Array.isArray(list) ? list : [];

  useEffect(() => {
    dispatch(fetchMyBookingsAsync());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-xl font-bold">My Bookings</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && bookings.length === 0 && (
        <p className="text-gray-500">You have no bookings yet.</p>
      )}

      <div className="space-y-3">
        {bookings.map((b) => (
          <Link
            key={b.id}
            to={`/bookings/${b.id}`}
            className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Venue #{b.venue_id}</p>
                <p className="text-sm text-gray-600">
                  {b.booking_date} at {b.time_slot}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={b.status} />
                <p className="mt-1 text-sm font-semibold">₹ {b.amount}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyBookingsPage;
