import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Calendar, Clock, Users, IndianRupee, FileText, Check, X, ChevronLeft, ChevronRight } from "lucide-react";

import OwnerLayout from "../components/VenueOwnerDashboard/OwnerLayout";
import {
  fetchOwnerBookingsAsync,
  acceptBookingRequestAsync,
  rejectBookingRequestAsync,
} from "../modules/venueOwner/venueOwnerSlice";

// ── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { key: "all",       label: "All Bookings" },
  { key: "upcoming",  label: "Upcoming" },
  { key: "past",      label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];

function resolveDisplayStatus(booking) {
  if (booking.status === "cancelled") return "cancelled";
  const isPast = new Date(booking.booking_date) < new Date(new Date().toDateString());
  if (booking.owner_status === "accepted" && isPast) return "completed";
  if (booking.owner_status === "accepted") return "confirmed";
  if (booking.owner_status === "rejected") return "rejected";
  return "pending";
}

const STATUS_CONFIG = {
  confirmed:  { label: "Confirmed",  classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  pending:    { label: "Pending",    classes: "bg-amber-50  text-amber-700  border border-amber-200"  },
  completed:  { label: "Completed",  classes: "bg-blue-50   text-blue-700   border border-blue-200"   },
  cancelled:  { label: "Cancelled",  classes: "bg-gray-100  text-gray-500   border border-gray-200"   },
  rejected:   { label: "Rejected",   classes: "bg-red-50    text-red-600    border border-red-200"    },
};

// ── Reject reason modal ───────────────────────────────────────────────────────

function RejectModal({ bookingId, onConfirm, onCancel, isSubmitting }) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Reject booking request</h2>
          <p className="text-xs text-gray-400 mt-1">
            Optionally tell the customer why you're rejecting this request.
          </p>
        </div>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="e.g. Venue is already reserved for a private event on that date."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 resize-none transition-all"
        />

        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Keep pending
          </button>
          <button
            onClick={() => onConfirm(reason.trim() || null)}
            disabled={isSubmitting}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : "Confirm reject"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Initials({ name }) {
  const parts = (name ?? "?").trim().split(" ");
  const text = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2);
  return (
    <div className="w-9 h-9 rounded-full bg-rose-900 text-white flex items-center justify-center text-xs font-bold shrink-0 uppercase">
      {text}
    </div>
  );
}

function StatusBadge({ booking }) {
  const key = resolveDisplayStatus(booking);
  const cfg = STATUS_CONFIG[key] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  );
}

function ActionButtons({ booking, actionBookingId, onAccept, onRejectClick }) {
  const displayStatus = resolveDisplayStatus(booking);
  const isActing = actionBookingId === booking.id;

  if (displayStatus !== "pending") {
    return (
      <button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold transition-colors">
        Manage
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onRejectClick(booking.id)}
        disabled={isActing}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors disabled:opacity-50"
      >
        {isActing ? <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" /> : <X size={12} />}
        Reject
      </button>
      <button
        onClick={() => onAccept(booking.id)}
        disabled={isActing}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-950 text-white text-xs font-semibold transition-colors disabled:opacity-50"
      >
        {isActing ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <Check size={12} />}
        Accept
      </button>
    </div>
  );
}

function BookingRow({ booking, actionBookingId, onAccept, onRejectClick }) {
  const d = new Date(booking.booking_date);
  const dateStr = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = booking.time_slot
    ? new Date(`1970-01-01T${booking.time_slot}`).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "—";

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
      <td className="py-4 px-5">
        <p className="text-sm font-semibold text-rose-900 leading-snug">{booking.venue?.name ?? "—"}</p>
        {booking.venue?.location && (
          <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
            <MapPin size={10} /> {booking.venue.location}
          </p>
        )}
      </td>

      <td className="py-4 px-5">
        <div className="flex items-center gap-2.5">
          <Initials name={booking.user?.name} />
          <div>
            <p className="text-sm font-medium text-gray-800">{booking.user?.name ?? "—"}</p>
            {booking.event_type && (
              <p className="text-[11px] text-gray-400 mt-0.5">{booking.event_type}</p>
            )}
          </div>
        </div>
      </td>

      <td className="py-4 px-5">
        <p className="text-sm text-gray-700 font-medium">{dateStr}</p>
        <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
          <Clock size={10} /> {timeStr}
        </p>
        {booking.guest_count != null && (
          <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
            <Users size={10} /> {booking.guest_count} guests
          </p>
        )}
      </td>

      <td className="py-4 px-5">
        <StatusBadge booking={booking} />
      </td>

      <td className="py-4 px-5">
        <p className="text-sm font-semibold text-gray-800 flex items-center gap-0.5">
          <IndianRupee size={13} />
          {Number(booking.amount).toLocaleString("en-IN")}
        </p>
      </td>

      <td className="py-4 px-5">
        <div className="flex items-center gap-2">
          {booking.notes && (
            <button
              title={booking.notes}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <FileText size={14} />
            </button>
          )}
          <ActionButtons
            booking={booking}
            actionBookingId={actionBookingId}
            onAccept={onAccept}
            onRejectClick={onRejectClick}
          />
        </div>
      </td>
    </tr>
  );
}

function BookingCard({ booking, actionBookingId, onAccept, onRejectClick }) {
  const d = new Date(booking.booking_date);
  const dateStr = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = booking.time_slot
    ? new Date(`1970-01-01T${booking.time_slot}`).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "—";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-rose-900">{booking.venue?.name ?? "—"}</p>
          {booking.venue?.location && (
            <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
              <MapPin size={10} /> {booking.venue.location}
            </p>
          )}
        </div>
        <StatusBadge booking={booking} />
      </div>

      <div className="flex items-center gap-2.5">
        <Initials name={booking.user?.name} />
        <div>
          <p className="text-sm font-medium text-gray-800">{booking.user?.name ?? "—"}</p>
          {booking.event_type && (
            <p className="text-[11px] text-gray-400">{booking.event_type}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] text-gray-500">
        <span className="flex items-center gap-1"><Calendar size={11} /> {dateStr}</span>
        <span className="flex items-center gap-1"><Clock size={11} /> {timeStr}</span>
        {booking.guest_count != null && (
          <span className="flex items-center gap-1"><Users size={11} /> {booking.guest_count} guests</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <p className="text-sm font-semibold text-gray-800 flex items-center gap-0.5">
          <IndianRupee size={13} />
          {Number(booking.amount).toLocaleString("en-IN")}
        </p>
        <ActionButtons
          booking={booking}
          actionBookingId={actionBookingId}
          onAccept={onAccept}
          onRejectClick={onRejectClick}
        />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="py-4 px-5">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
          {i < 2 && <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2 mt-2" />}
        </td>
      ))}
    </tr>
  );
}

function EmptyState({ tab }) {
  const messages = {
    all:       { title: "No bookings yet",       sub: "Bookings from customers will appear here." },
    upcoming:  { title: "No upcoming bookings",  sub: "Accepted future bookings will show here."  },
    past:      { title: "No past bookings",      sub: "Completed bookings will appear here."      },
    cancelled: { title: "No cancelled bookings", sub: "Cancelled bookings will appear here."      },
  };
  const m = messages[tab] ?? messages.all;
  return (
    <tr>
      <td colSpan={6} className="py-16 text-center">
        <p className="text-sm font-medium text-gray-500">{m.title}</p>
        <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
      </td>
    </tr>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

function OwnerBookingsPage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("all");

  // ← NEW: modal state — null means closed, a number means that booking id is pending rejection
  const [rejectModal, setRejectModal] = useState(null); // booking id | null
  const [isRejecting, setIsRejecting] = useState(false);

  const { ownerBookings, loading } = useSelector((s) => s.venueOwner);
  const { items, total, page, limit } = ownerBookings;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const load = useCallback(
    (tab, pg) => {
      dispatch(fetchOwnerBookingsAsync({ tab, page: pg, limit: 10 }));
    },
    [dispatch],
  );

  useEffect(() => {
    load(activeTab, 1);
  }, [activeTab, load]);

  const handleTabChange = (key) => setActiveTab(key);
  const handlePageChange = (pg) => load(activeTab, pg);

  const handleAccept = (id) => {
    dispatch(acceptBookingRequestAsync(id)).then(() => load(activeTab, page));
  };

  // ← NEW: open modal instead of immediately rejecting
  const handleRejectClick = (id) => {
    setRejectModal(id);
  };

  // ← NEW: called by modal on confirm
  const handleRejectConfirm = async (reason) => {
    setIsRejecting(true);
    await dispatch(rejectBookingRequestAsync({ id: rejectModal, reason }));
    setIsRejecting(false);
    setRejectModal(null);
    load(activeTab, page);
  };

  const isLoading = loading.ownerBookings;
  const actionBookingId = loading.actionBooking;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end   = Math.min(page * limit, total);

  return (
    <OwnerLayout>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Bookings</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage and respond to booking requests across all your venues.</p>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === t.key
                  ? "bg-white text-rose-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Venue Name", "Customer", "Date & Time", "Status", "Amount", "Actions"].map((h) => (
                  <th key={h} className="py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : items.length === 0
                  ? <EmptyState tab={activeTab} />
                  : items.map((b) => (
                      <BookingRow
                        key={b.id}
                        booking={b}
                        actionBookingId={actionBookingId}
                        onAccept={handleAccept}
                        onRejectClick={handleRejectClick}
                      />
                    ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
              ))
            : items.length === 0
              ? (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center">
                  <p className="text-sm text-gray-500">No bookings found.</p>
                </div>
              )
              : items.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    actionBookingId={actionBookingId}
                    onAccept={handleAccept}
                    onRejectClick={handleRejectClick}
                  />
                ))}
        </div>

        {/* Pagination */}
        {!isLoading && total > 0 && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-gray-400">
              Showing {start} to {end} of {total.toLocaleString()} bookings
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((pg) => pg === 1 || pg === totalPages || Math.abs(pg - page) <= 1)
                .reduce((acc, pg, idx, arr) => {
                  if (idx > 0 && pg - arr[idx - 1] > 1) acc.push("ellipsis-" + pg);
                  acc.push(pg);
                  return acc;
                }, [])
                .map((pg) =>
                  typeof pg === "string" ? (
                    <span key={pg} className="px-1 text-gray-400 text-xs">…</span>
                  ) : (
                    <button
                      key={pg}
                      onClick={() => handlePageChange(pg)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        pg === page
                          ? "bg-rose-900 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pg}
                    </button>
                  ),
                )}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ← NEW: Reject reason modal, rendered outside the table */}
      {rejectModal !== null && (
        <RejectModal
          bookingId={rejectModal}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectModal(null)}
          isSubmitting={isRejecting}
        />
      )}
    </OwnerLayout>
  );
}

export default OwnerBookingsPage;