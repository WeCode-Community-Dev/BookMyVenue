import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { getAdminVenueById } from "../../services/admin.service.js";

// Joins the venue's address parts into a single readable line, skipping blanks.
function formatAddress(venue) {
  return [venue.addressLine, venue.city, venue.district, venue.state, venue.pincode]
    .filter(Boolean)
    .join(", ");
}

// Placeholder for fields the venue model doesn't have yet (contact, amenities).
const NOT_PROVIDED = "Not provided";

export function AdminVenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    let active = true;
    async function loadVenueDetails() {
      setLoading(true);
      setError("");
      try {
        const data = await getAdminVenueById(id);
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

  const handleApprove = () => {
    alert(`Venue ${id} approved`);
    navigate("/admin/venues/pending");
  };

  const handleReject = () => {
    if (!reason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }

    alert(`Venue ${id} rejected\nReason: ${reason}`);
    navigate("/admin/venues/pending");
  };

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
          <p className="text-sm text-gray-500">{NOT_PROVIDED}</p>
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
            className="rounded-lg border border-red-600 px-6 py-3 font-medium text-red-600 hover:bg-red-50"
          >
            Reject
          </button>

          <button
            onClick={handleApprove}
            className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
          >
            Approve
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

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}