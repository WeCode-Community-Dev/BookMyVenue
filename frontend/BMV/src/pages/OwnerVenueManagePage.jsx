import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft, MapPin, Users, IndianRupee, Calendar, Clock,
  Tag, ChevronLeft, ChevronRight, Check, X, FileText,
} from "lucide-react";

import OwnerLayout from "../components/VenueOwnerDashboard/OwnerLayout";
import {
  fetchVenueByIdAsync,
  fetchVenueBookingsAsync,
  acceptBookingRequestAsync,
  rejectBookingRequestAsync,
  clearActiveVenue,
  clearVenueBookings,
} from "../modules/venueOwner/venueOwnerSlice";

// ── Approval badge config ─────────────────────────────────────────────────────

const APPROVAL_BADGE = {
  approved: "bg-emerald-100 text-emerald-700",
  pending:  "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};
const APPROVAL_LABEL = {
  approved: "Approved",
  pending:  "Pending Approval",
  rejected: "Rejected",
};

// ── Booking display status ────────────────────────────────────────────────────

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
  pending:    { label: "Pending",    classes: "bg-amber-50 text-amber-700 border border-amber-200"       },
  completed:  { label: "Completed",  classes: "bg-blue-50 text-blue-700 border border-blue-200"          },
  cancelled:  { label: "Cancelled",  classes: "bg-gray-100 text-gray-500 border border-gray-200"         },
  rejected:   { label: "Rejected",   classes: "bg-red-50 text-red-600 border border-red-200"             },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function Initials({ name }) {
  const parts = (name ?? "?").trim().split(" ");
  const text = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2);
  return (
    <div className="w-8 h-8 rounded-full bg-rose-900 text-white flex items-center justify-center text-xs font-bold shrink-0 uppercase">
      {text}
    </div>
  );
}

function StatusBadge({ booking }) {
  const key = resolveDisplayStatus(booking);
  const cfg = STATUS_CONFIG[key] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  );
}

function ActionButtons({ booking, actionBookingId, onAccept, onReject }) {
  const displayStatus = resolveDisplayStatus(booking);
  const isActing = actionBookingId === booking.id;
  if (displayStatus !== "pending") return null;
  return (
    <div className="flex items-center gap-1.5 mt-2">
      <button
        onClick={() => onReject(booking.id)}
        disabled={isActing}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors disabled:opacity-50"
      >
        {isActing
          ? <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
          : <X size={11} />}
        Reject
      </button>
      <button
        onClick={() => onAccept(booking.id)}
        disabled={isActing}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-900 hover:bg-rose-950 text-white text-xs font-semibold transition-colors disabled:opacity-50"
      >
        {isActing
          ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
          : <Check size={11} />}
        Accept
      </button>
    </div>
  );
}

// Desktop table row
function BookingRow({ booking, actionBookingId, onAccept, onReject }) {
  const dateStr = new Date(booking.booking_date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const timeStr = booking.time_slot
    ? new Date(`1970-01-01T${booking.time_slot}`).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", hour12: true,
      })
    : "—";

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <Initials name={booking.user?.name} />
          <div>
            <p className="text-sm font-medium text-gray-800">{booking.user?.name ?? "—"}</p>
            {booking.event_type && (
              <p className="text-[11px] text-gray-400">{booking.event_type}</p>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-gray-700">{dateStr}</p>
        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
          <Clock size={10} /> {timeStr}
        </p>
      </td>
      <td className="py-3 px-4">
        {booking.guest_count != null
          ? <span className="flex items-center gap-1 text-sm text-gray-600"><Users size={12} /> {booking.guest_count}</span>
          : <span className="text-gray-400">—</span>}
      </td>
      <td className="py-3 px-4">
        <StatusBadge booking={booking} />
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-semibold text-gray-800 flex items-center gap-0.5">
          <IndianRupee size={12} />
          {Number(booking.amount).toLocaleString("en-IN")}
        </p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5">
          {booking.notes && (
            <button title={booking.notes} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <FileText size={13} />
            </button>
          )}
          <ActionButtons
            booking={booking}
            actionBookingId={actionBookingId}
            onAccept={onAccept}
            onReject={onReject}
          />
        </div>
      </td>
    </tr>
  );
}

// Mobile card
function BookingCard({ booking, actionBookingId, onAccept, onReject }) {
  const dateStr = new Date(booking.booking_date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const timeStr = booking.time_slot
    ? new Date(`1970-01-01T${booking.time_slot}`).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", hour12: true,
      })
    : "—";

  return (
    <div className="p-4 border-b border-gray-50 last:border-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Initials name={booking.user?.name} />
          <div>
            <p className="text-sm font-medium text-gray-800">{booking.user?.name ?? "—"}</p>
            {booking.event_type && (
              <p className="text-[11px] text-gray-400">{booking.event_type}</p>
            )}
          </div>
        </div>
        <StatusBadge booking={booking} />
      </div>

      <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-gray-500">
        <span className="flex items-center gap-1"><Calendar size={10} /> {dateStr}</span>
        <span className="flex items-center gap-1"><Clock size={10} /> {timeStr}</span>
        {booking.guest_count != null && (
          <span className="flex items-center gap-1"><Users size={10} /> {booking.guest_count} guests</span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-sm font-semibold text-gray-800 flex items-center gap-0.5">
          <IndianRupee size={12} />
          {Number(booking.amount).toLocaleString("en-IN")}
        </p>
        <ActionButtons
          booking={booking}
          actionBookingId={actionBookingId}
          onAccept={onAccept}
          onReject={onReject}
        />
      </div>
    </div>
  );
}

const TABS = [
  { key: "all",       label: "All" },
  { key: "upcoming",  label: "Upcoming" },
  { key: "past",      label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];

// ── Bookings section ──────────────────────────────────────────────────────────

function VenueBookingsSection({ venueId }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("all");

  const { venueBookings, loading } = useSelector((s) => s.venueOwner);
  const { items, total, page, limit } = venueBookings;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const actionBookingId = loading.actionBooking;
  const isLoading = loading.venueBookings;

  const load = useCallback(
    (tab, pg) => {
      dispatch(fetchVenueBookingsAsync({ venue_id: venueId, tab, page: pg, limit: 10 }));
    },
    [dispatch, venueId],
  );

  useEffect(() => { load(activeTab, 1); }, [activeTab, load]);

  const handleAccept = (id) => {
    dispatch(acceptBookingRequestAsync(id)).then(() => load(activeTab, page));
  };
  const handleReject = (id) => {
    dispatch(rejectBookingRequestAsync(id)).then(() => load(activeTab, page));
  };

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end   = Math.min(page * limit, total);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-rose-900">Bookings</h3>
        {total > 0 && (
          <span className="text-xs text-gray-400">{total} total</span>
        )}
      </div>

      {/* Tab bar */}
      <div className="px-5 pt-3">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === t.key
                  ? "bg-white text-rose-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop table ─────────────────────────────────────────────────── */}
      <div className="hidden md:block mt-3">
        {isLoading ? (
          <div className="px-5 py-8 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-gray-500">No bookings found.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Customer", "Date & Time", "Guests", "Status", "Amount", "Actions"].map((h) => (
                  <th key={h} className="py-2.5 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  actionBookingId={actionBookingId}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Mobile cards ──────────────────────────────────────────────────── */}
      <div className="md:hidden mt-3">
        {isLoading ? (
          <div className="px-4 py-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-gray-500">No bookings found.</p>
          </div>
        ) : (
          items.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              actionBookingId={actionBookingId}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))
        )}
      </div>

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      {!isLoading && total > 0 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {start}–{end} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => load(activeTab, page - 1)}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={13} />
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
                    onClick={() => load(activeTab, pg)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
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
              onClick={() => load(activeTab, page + 1)}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function OwnerVenueManagePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeVenue: venue, loading, error } = useSelector((s) => s.venueOwner);

  useEffect(() => {
    dispatch(clearActiveVenue());
    dispatch(clearVenueBookings());
    dispatch(fetchVenueByIdAsync(id));
    return () => {
      dispatch(clearActiveVenue());
      dispatch(clearVenueBookings());
    };
  }, [dispatch, id]);

  if (loading.activeVenue) {
    return (
      <OwnerLayout>
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-48 bg-gray-100 rounded-lg" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </OwnerLayout>
    );
  }

  if (error || !venue) {
    return (
      <OwnerLayout>
        <div className="p-8 text-center text-sm text-red-500">
          {error || "Venue not found."}
        </div>
      </OwnerLayout>
    );
  }

  const approvalClass = APPROVAL_BADGE[venue.approval_status] || APPROVAL_BADGE.pending;
  const approvalLabel = APPROVAL_LABEL[venue.approval_status] || "Pending";

  return (
    <OwnerLayout>
      {/* Back + header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">{venue.name}</h2>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <MapPin size={11} /> {venue.location}
          </p>
        </div>
        <Link
          to={`/owner/venues/${venue.id}/edit`}
          className="px-4 py-2 rounded-full border border-rose-200 text-rose-800 hover:bg-rose-50 text-xs font-semibold transition-colors"
        >
          Edit Details
        </Link>
      </div>

      <div className="space-y-5">
        {/* Venue summary card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${approvalClass}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {approvalLabel}
              </span>
              {venue.venue_type && (
                <p className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Tag size={12} className="text-gray-400" />
                  {venue.venue_type.name}
                </p>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[10px] font-semibold text-gray-400 tracking-wide">CAPACITY</p>
                <p className="flex items-center gap-1 text-sm font-bold text-gray-800 mt-1 justify-center">
                  <Users size={13} className="text-rose-800" />
                  {venue.capacity ?? "—"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold text-gray-400 tracking-wide">DAILY RATE</p>
                <p className="flex items-center gap-1 text-sm font-bold text-gray-800 mt-1 justify-center">
                  <IndianRupee size={13} className="text-emerald-600" />
                  {Number(venue.price_per_day).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {venue.amenities?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[10px] font-semibold text-gray-400 tracking-wide mb-2">AMENITIES</p>
              <div className="flex flex-wrap gap-1.5">
                {venue.amenities.map((a) => (
                  <span key={a.id} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                    {a.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {venue.description && (
            <p className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 leading-relaxed">
              {venue.description}
            </p>
          )}
        </div>

        {/* Per-venue bookings */}
        <VenueBookingsSection venueId={Number(id)} />

        {/* Rejection reason */}
        {venue.approval_status === "rejected" && venue.rejection_reason && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <p className="text-xs font-semibold text-red-700 mb-1">Rejection Reason</p>
            <p className="text-sm text-red-600">{venue.rejection_reason}</p>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}

export default OwnerVenueManagePage;