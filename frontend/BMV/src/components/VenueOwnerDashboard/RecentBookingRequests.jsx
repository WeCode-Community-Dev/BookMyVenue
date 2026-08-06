import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Users } from "lucide-react";
import {
  acceptBookingRequestAsync,
  rejectBookingRequestAsync,
} from "../../modules/venueOwner/venueOwnerSlice";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function RecentBookingRequests({ requests, loading }) {
  const dispatch = useDispatch();

  const handleAccept = (id) => dispatch(acceptBookingRequestAsync(id));
  const handleReject = (id) => dispatch(rejectBookingRequestAsync(id));

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-rose-900">Recent Booking Requests</h3>
        <Link to="/owner/bookings" className="text-xs font-medium text-rose-700 hover:underline">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="p-5 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-400">
          No pending booking requests right now.
        </div>
      ) : (
        <>
          <div className="hidden md:grid grid-cols-[2fr_1fr_1.4fr_0.8fr_1.2fr] gap-3 px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            <span>Venue &amp; Event</span>
            <span>Date &amp; Time</span>
            <span>Details</span>
            <span>Price</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-gray-50">
            {requests.map((req) => (
              <div
                key={req.id}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1.4fr_0.8fr_1.2fr] gap-3 items-center px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-lg shrink-0"
                    style={{ backgroundColor: req.thumbnail_color }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-rose-900 leading-tight">
                      {req.event_type}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{req.venue_name}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {formatDate(req.event_date)}
                  <br />
                  <span className="text-xs text-gray-400">{req.event_time}</span>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Users size={14} className="text-gray-400" />
                  {req.guest_count} Guests
                </div>

                <div className="text-sm font-semibold text-gray-900">
                  ₹{req.price.toLocaleString("en-IN")}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAccept(req.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-950 text-white text-xs font-semibold transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(req.id)}
                    className="px-3.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 text-xs font-semibold transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-4">
            <Link
              to="/owner/bookings"
              className="block w-full py-2.5 rounded-xl border border-rose-200 text-rose-800 text-sm font-semibold hover:bg-rose-50 transition-colors text-center"
            >
              View All Requests
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default RecentBookingRequests;
