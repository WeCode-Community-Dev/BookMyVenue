import Header from "@/presentation/components/common/Header";
import UserSidebar from "@/presentation/components/user/UserSidebar";
import BookingHistoryCard from "@/presentation/components/user/BookingHistoryCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getBookings } from "@/redux/slices/UserBookingSlice";

const BookingHistory = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { bookings, loading, pagination } = useSelector(
    (state) => state.userBooking
  );

  useEffect(() => {
    dispatch(
      getBookings({
        page,
        limit: 5,
        status,
      })
    );
  }, [dispatch, page, status]);

  const start = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;

  const end = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  return (
    <>
      <Header />

      <div className="flex">
        <UserSidebar />

        <main className="flex-1 bg-gray-50 p-10">
          <div className="bg-white rounded-3xl shadow-md p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold">Booking History</h1>

                <p className="text-gray-500 mt-2">
                  View your past and upcoming bookings
                </p>
              </div>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1); // Go back to first page when filter changes
                }}
                className="border rounded-xl px-4 py-2"
              >
                <option value="">All Bookings</option>
                <option value="confirmed">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            {bookings.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-7xl">📅</div>

                <h2 className="text-2xl font-bold mt-5">No bookings yet</h2>

                <p className="text-gray-500 mt-3">
                  Book your first venue to see it here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {bookings.map((booking) => (
                  <BookingHistoryCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}

            {bookings.length > 0 && (
              <>
                <div className="flex justify-between items-center mt-8">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => setPage(page - 1)}
                    className="border px-4 py-2 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="border px-4 py-2 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                <p className="text-gray-500 mt-6">
                  Showing {start} to {end} of {pagination.total} bookings
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default BookingHistory;
