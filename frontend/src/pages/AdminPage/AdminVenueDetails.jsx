import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import {
  adminGetVenueById,
  adminApproveVenue,
  adminRejectVenue,
} from "../../services/admin.service.js";
import { showInfo } from "../../utils/toastBus.js";

// Joins the venue's address parts into a single readable line, skipping blanks.
function formatAddress(venue) {
  return [venue.addressLine, venue.city, venue.district, venue.state, venue.pincode]
    .filter(Boolean)
    .join(", ");
}

// Which review-queue tab a venue belongs to, so we return to the right one.
function listTabFor(venue) {
  return venue.status === "CHANGES_PENDING" ? "edits" : "new";
}

// Placeholder for fields the venue model doesn't have yet (contact info).
const NOT_PROVIDED = "Not provided";
// Mirrors the backend's REJECTION_REASON_MIN_LENGTH so the admin gets immediate
// feedback; the server remains the source of truth.
const REJECT_REASON_MIN_LENGTH = 10;

// The two review actions. The keys double as the `submitting` value, so the
// idle/pending button labels stay in sync with the in-flight state.
const REVIEW_ACTIONS = {
  approve: { idle: "Approve", pending: "Approving…" },
  reject: { idle: "Reject", pending: "Rejecting…" },
};

export function AdminVenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState("");

  useEffect(() => {
    let active = true;
    async function loadVenueDetails() {
      setLoading(true);
      setError("");
      try {
        const data = await adminGetVenueById(id);
        if (active) setVenue(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadVenueDetails();
    return () => {
      active = false;
    };
  }, [id]);

  // Back to the queue the venue came from (new vs edits tab).
  function backToList() {
    navigate(`/admin/venues/pending?activeTab=${listTabFor(venue)}`);
  }

  async function handleApprove() {
    if (submitting) return;
    setSubmitting("approve");
    try {
      await adminApproveVenue(id);
      showInfo("Venue approved");
      backToList();
    } catch {
      // api client toasts the error; return to the (now-refreshed) list.
      backToList();
    }
  }

  async function handleReject() {
    if (submitting) return;
    if (reason.trim().length < REJECT_REASON_MIN_LENGTH) return;
    setSubmitting("reject");
    try {
      await adminRejectVenue(id, reason.trim());
      showInfo("Venue rejected");
      backToList();
    } catch {
      // api client toasts the error; return to the (now-refreshed) list.
      backToList();
    }
  }

  // Idle/pending label for an action button, driven by which action is in flight.
  function actionLabel(action) {
    return submitting === action ? REVIEW_ACTIONS[action].pending : REVIEW_ACTIONS[action].idle;
  }

  if (loading) {
    return <p className="py-10 text-center text-sm text-gray-400">Loading venue...</p>;
  }

  if (error) {
    return <p className="py-10 text-center text-sm text-red-500">{error}</p>;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Venue Review
          </h1>
          <p className="mt-2 text-gray-500">
            Review venue details before approval.
          </p>

          {/* For an edit copy, link to the live original listing for comparison. */}
          {venue.editOf && (
            <a
              href={`/venue/${venue.editOf}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
            >
              View live venue details
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        {/* Basic Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Venue Name
              </label>
              <p className="mt-1 font-medium">{venue.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Category
              </label>
              <p className="mt-1">{venue.venueCategory?.name || NOT_PROVIDED}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Capacity
              </label>
              <p className="mt-1">{venue.capacity} Guests</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Base Price</label>
              <p className="mt-1">₹{venue.basePrice}</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-500">
              Description
            </label>
            <p className="mt-1">{venue.description}</p>
          </div>
        </div>

        {/* Location */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Location
          </h2>

          <label className="text-sm font-medium text-gray-500">
            Address
          </label>
          <p className="mt-1">{formatAddress(venue)}</p>
        </div>

        {/* Contact */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Contact Person
              </label>
              <p className="mt-1">{NOT_PROVIDED}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Phone
              </label>
              <p className="mt-1">{NOT_PROVIDED}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Email
              </label>
              <p className="mt-1">{NOT_PROVIDED}</p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-2">
            {venue.amenities.map((amenity) => (
              <span
                key={amenity._id}
                className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-600"
              >
                {amenity.name}
              </span>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Venue Images
          </h2>

          {venue.images?.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {venue.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Venue ${index + 1}`}
                  className="h-56 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{NOT_PROVIDED}</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={!!submitting}
            className="rounded-lg border border-red-600 px-6 py-3 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLabel("reject")}
          </button>

          <button
            onClick={handleApprove}
            disabled={!!submitting}
            className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLabel("approve")}
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6">
            <h2 className="text-xl font-semibold">
              Reject Venue
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Provide a reason for rejecting this venue.
            </p>

            <textarea
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="mt-4 w-full rounded-lg border border-gray-300 p-3"
            />
            <p className="mt-1 text-xs text-gray-400">
              Minimum {REJECT_REASON_MIN_LENGTH} characters.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={!!submitting}
                className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={reason.trim().length < REJECT_REASON_MIN_LENGTH || !!submitting}
                className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting === "reject" ? REVIEW_ACTIONS.reject.pending : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}