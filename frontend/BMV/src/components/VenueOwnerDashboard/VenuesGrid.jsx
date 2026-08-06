import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Users, IndianRupee, Trash2, PowerOff } from "lucide-react";

const STATUS_BADGE = {
  approved: "bg-emerald-500 text-white",
  pending_approval: "bg-amber-500 text-white",
  pending: "bg-amber-500 text-white",
  rejected: "bg-gray-400 text-white",
};

const STATUS_LABEL = {
  approved: "Approved",
  pending_approval: "Pending Approval",
  pending: "Pending Approval",
  rejected: "Rejected",
};

const PLACEHOLDER_COLORS = ["#3b1f2b", "#1f2937", "#4a2c1a", "#1e3a3a", "#3a1e3a"];

function placeholderColorFor(id) {
  const index = Number(id) % PLACEHOLDER_COLORS.length;
  return PLACEHOLDER_COLORS[Number.isNaN(index) ? 0 : index];
}

function ConfirmDialog({ isOpen, title, message, confirmLabel, confirmClassName, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors ${confirmClassName}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function VenueCard({ venue, onDelete, onDeactivate, deleting, deactivating }) {
  const [dialog, setDialog] = useState(null); // null | "delete" | "deactivate"
  const placeholderColor = placeholderColorFor(venue.id);
  const hasRating = venue.average_rating != null && venue.average_rating > 0;
  const isApproved = venue.approval_status === "approved";
  const isPendingOrRejected =
    venue.approval_status === "pending" ||
    venue.approval_status === "pending_approval" ||
    venue.approval_status === "rejected";

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div
          className="h-40 relative"
          style={
            venue.image_url
              ? { backgroundImage: `url(${venue.image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: `linear-gradient(135deg, ${placeholderColor}, ${placeholderColor}cc)` }
          }
        >
          <span className={`absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[venue.approval_status] || STATUS_BADGE.pending}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            {STATUS_LABEL[venue.approval_status] || "Pending Approval"}
          </span>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-rose-900 leading-snug">{venue.name}</h4>
            <span className="flex items-center gap-1 shrink-0 mt-0.5">
              <Star size={13} className={hasRating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
              <span className={`text-xs font-medium ${hasRating ? "text-gray-700" : "text-gray-400"}`}>
                {hasRating ? venue.average_rating : "N/A"}
              </span>
            </span>
          </div>

          <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
            <MapPin size={12} /> {venue.location}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 tracking-wide">CAPACITY</p>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mt-1">
                <Users size={13} className="text-rose-800" />
                {venue.capacity ?? "—"} Guests
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 tracking-wide">DAILY RATE</p>
              <p className="flex items-center gap-1 text-sm font-semibold text-gray-800 mt-1">
                <IndianRupee size={13} className="text-emerald-600" />
                {Number(venue.price_per_day).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Link
              to={`/owner/venues/${venue.id}/manage`}
              className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold transition-colors text-center"
            >
              Manage
            </Link>
            <Link
              to={`/owner/venues/${venue.id}/edit`}
              className="flex-1 py-2 rounded-lg border border-rose-200 text-rose-800 hover:bg-rose-50 text-xs font-semibold transition-colors text-center"
            >
              Edit Details
            </Link>
          </div>

          {/* ── Delete (pending/rejected) or Deactivate (approved) ── */}
          <div className="mt-2">
            {isPendingOrRejected && (
              <button
                onClick={() => setDialog("delete")}
                disabled={deleting}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-red-600 border border-red-100 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 size={13} />
                {deleting ? "Deleting…" : "Delete Venue"}
              </button>
            )}
            {isApproved && (
              <button
                onClick={() => setDialog("deactivate")}
                disabled={deactivating}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-amber-700 border border-amber-100 hover:bg-amber-50 transition-colors disabled:opacity-50"
              >
                <PowerOff size={13} />
                {deactivating ? "Deactivating…" : "Deactivate Venue"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={dialog === "delete"}
        title="Delete this venue?"
        message="This will permanently remove the venue and all its data. This action cannot be undone."
        confirmLabel="Yes, Delete"
        confirmClassName="bg-red-600 hover:bg-red-700"
        onConfirm={() => { setDialog(null); onDelete(venue.id); }}
        onCancel={() => setDialog(null)}
      />

      {/* Deactivate confirmation */}
      <ConfirmDialog
        isOpen={dialog === "deactivate"}
        title="Deactivate this venue?"
        message="The venue will be hidden from customers. All upcoming bookings will be automatically cancelled and customers will be notified."
        confirmLabel="Yes, Deactivate"
        confirmClassName="bg-amber-600 hover:bg-amber-700"
        onConfirm={() => { setDialog(null); onDeactivate(venue.id); }}
        onCancel={() => setDialog(null)}
      />
    </>
  );
}

function VenuesGrid({ venues, loading, onDelete, onDeactivate, deletingId, deactivatingId }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[340px] rounded-2xl bg-gray-50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!venues || venues.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center">
        <p className="text-sm text-gray-500">You haven&apos;t added any venues yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {venues.map((v) => (
        <VenueCard
          key={v.id}
          venue={v}
          onDelete={onDelete}
          onDeactivate={onDeactivate}
          deleting={deletingId === v.id}
          deactivating={deactivatingId === v.id}
        />
      ))}
    </div>
  );
}

export default VenuesGrid;