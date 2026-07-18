import { Link } from "@tanstack/react-router";
import {
  MapPin,
  Users,
  DollarSign,
  Building2,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  pending: {
    label: "Pending Approval",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  inactive: {
    label: "Inactive",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  suspended: {
    label: "Suspended",
    className: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  },
  rejected: {
    label: "Rejected",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value) => {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-US").format(value);
};

export function AdminVenueCard({
  venue,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onSuspend,
  onActivate,
  onViewDetails,
  showActions = true,
}) {
  const status = statusConfig[venue?.status] || statusConfig.inactive;

  const handleAction = (callback) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (callback) callback(venue);
  };

  const isPending = venue?.status === "pending";
  const isSuspended = venue?.status === "suspended";
  const isActive = venue?.status === "active";

  return (
    <article
      role="article"
      aria-label={`Venue: ${venue?.name || "Unnamed venue"}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {venue?.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Building2 className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold leading-tight">
            {venue?.name || "Unnamed venue"}
          </h3>
          {venue?.rating && (
            <div className="flex shrink-0 items-center gap-1 text-amber-500">
              <span className="text-sm font-medium">{venue.rating}</span>
              <span className="text-xs text-muted-foreground">/5</span>
            </div>
          )}
        </div>

        <div className="mb-4 space-y-2 text-sm text-muted-foreground">
          {venue?.owner && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{venue.owner.name || venue.owner.email || "Unknown owner"}</span>
            </div>
          )}
          {venue?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{venue.location}</span>
            </div>
          )}
          <div className="flex items-center gap-4">
            {venue?.capacity !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0" />
                <span>{formatNumber(venue.capacity)}</span>
              </div>
            )}
            {venue?.pricePerHour !== undefined && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 shrink-0" />
                <span>{formatCurrency(venue.pricePerHour)}/hr</span>
              </div>
            )}
          </div>
        </div>

        {showActions && (
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 border-t border-border">
            {onViewDetails && (
              <Link
                to="/admin/venues/$venueId"
                params={{ venueId: venue?.id }}
                className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </Link>
            )}

            {isPending && (
              <>
                {onApprove && (
                  <button
                    type="button"
                    onClick={handleAction(onApprove)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Approve
                  </button>
                )}
                {onReject && (
                  <button
                    type="button"
                    onClick={handleAction(onReject)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Reject
                  </button>
                )}
              </>
            )}

            {isActive && onSuspend && (
              <button
                type="button"
                onClick={handleAction(onSuspend)}
                className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-700"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                Suspend
              </button>
            )}

            {(isSuspended || isInactive) && onActivate && (
              <button
                type="button"
                onClick={handleAction(onActivate)}
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Activate
              </button>
            )}

            {onEdit && (
              <Link
                to="/admin/venues/$venueId/edit"
                params={{ venueId: venue?.id }}
                className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                onClick={(e) => e.stopPropagation()}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={handleAction(onDelete)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default AdminVenueCard;
