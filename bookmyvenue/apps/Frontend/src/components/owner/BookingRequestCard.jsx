import { Link } from "@tanstack/react-router";
import { Calendar, Clock, MapPin, User, DollarSign, MessageSquare } from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  approved: {
    label: "Approved",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
};

export function BookingRequestCard({
  booking,
  onApprove,
  onReject,
  onViewDetails,
  showActions = true,
}) {
  const status = booking?.status?.toLowerCase?.() || "pending";
  const config = statusConfig[status] || statusConfig.pending;

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value) => {
    if (value == null) return "$—";
    return `$${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleApprove = (e) => {
    e.stopPropagation();
    onApprove?.(booking);
  };

  const handleReject = (e) => {
    e.stopPropagation();
    onReject?.(booking);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    onViewDetails?.(booking);
  };

  return (
    <article
      className="group relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-white/20 hover:bg-white/[0.07]"
      aria-label={`Booking request from ${booking?.customer?.name || "a customer"} for ${booking?.venue?.name || "a venue"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-white">
            {booking?.venue?.name || "Venue"}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-sm text-white/60">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {booking?.venue?.location || "Location unavailable"}
            </span>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
        >
          {config.label}
        </span>
      </div>

      <div className="grid gap-3 text-sm text-white/70 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <User className="h-4 w-4 text-white/80" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-white">{booking?.customer?.name || "Guest"}</p>
            <p className="truncate text-xs text-white/50">
              {booking?.customer?.email || "No email provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <Calendar className="h-4 w-4 text-white/80" />
          </div>
          <div>
            <p className="text-white">{formatDate(booking?.startTime)}</p>
            <p className="text-xs text-white/50">Booking date</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <Clock className="h-4 w-4 text-white/80" />
          </div>
          <div>
            <p className="text-white">
              {formatTime(booking?.startTime)} — {formatTime(booking?.endTime)}
            </p>
            <p className="text-xs text-white/50">Time window</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <DollarSign className="h-4 w-4 text-white/80" />
          </div>
          <div>
            <p className="text-white">{formatCurrency(booking?.totalAmount)}</p>
            <p className="text-xs text-white/50">Total</p>
          </div>
        </div>
      </div>

      {booking?.message && (
        <div className="flex items-start gap-2 rounded-xl bg-white/5 p-3 text-sm text-white/70">
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
          <p className="line-clamp-2">{booking.message}</p>
        </div>
      )}

      {showActions && (
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          {status === "pending" && (
            <>
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/40"
              >
                Reject
              </button>
            </>
          )}

          {onViewDetails ? (
            <button
              type="button"
              onClick={handleViewDetails}
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              View details
            </button>
          ) : (
            <Link
              to="/owner/bookings/$bookingId"
              params={{ bookingId: String(booking?.id) }}
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              View details
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

export default BookingRequestCard;
