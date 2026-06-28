import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getMyVenues,
  activateVenue,
  deactivateVenue,
} from "../../services/venueService";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { formatBookingPriceDisplay } from "../../utils/formatPrice";
import { getVenueCoverUrl } from "../../utils/venue";

const formatLocation = (city, state) => {
  if (city && state) return `${city}, ${state}`;
  return city || state || "Location not specified";
};

const ProviderVenueCard = ({
  venue,
  onToggleStatus,
  isToggling,
}) => {
  const coverUrl = getVenueCoverUrl(venue);

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-44 w-full shrink-0 bg-gray-100 sm:h-auto sm:w-52">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={venue?.title || "Venue"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[12rem] items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {venue?.title || "Untitled venue"}
            </h2>

            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                venue.isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {venue.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            {formatLocation(venue.city, venue.state)}
          </p>

          <p className="mt-3 font-semibold text-red-600">
            {formatBookingPriceDisplay(venue.price)}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to={`/provider/venues/${venue._id}/edit`}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Edit Venue
            </Link>

            <Link
              to={`/provider/venues/${venue._id}/availability`}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Manage Availability
            </Link>

            <button
              type="button"
              onClick={() => onToggleStatus(venue)}
              disabled={isToggling}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isToggling
                ? "Updating..."
                : venue.isActive
                  ? "Deactivate"
                  : "Activate"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const MyVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingVenueId, setTogglingVenueId] = useState(null);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyVenues();

      if (data.success) {
        setVenues(data.data ?? []);
      } else {
        setVenues([]);
        setError(data.message || "Failed to load venues.");
      }
    } catch (err) {
      setVenues([]);
      setError(
        err.response?.data?.message ||
          "Unable to load venues. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleToggleStatus = async (venue) => {
    if (togglingVenueId) return;

    const venueId = venue._id;
    const wasActive = venue.isActive;

    try {
      setTogglingVenueId(venueId);

      const data = wasActive
        ? await deactivateVenue(venueId)
        : await activateVenue(venueId);

      if (!data.success) {
        throw new Error(data.message || "Failed to update venue status.");
      }

      setVenues((prev) =>
        prev.map((v) =>
          v._id === venueId
            ? { ...v, isActive: data.data?.isActive ?? !wasActive }
            : v
        )
      );

      toast.success(data.message || "Venue status updated.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update venue status."
      );
    } finally {
      setTogglingVenueId(null);
    }
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">My Venues</h1>
          <p className="mt-2 text-base text-gray-500">
            Manage your listed venues and availability.
          </p>
        </div>

        <Link
          to="/provider/venues/new"
          className="inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Create Venue
        </Link>
      </div>

      {loading && <Loader label="Loading your venues..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchVenues} />
      )}

      {!loading && !error && venues.length === 0 && (
        <div>
          <EmptyState
            title="No venues created yet"
            description="List your first venue to start accepting bookings."
          />

          <div className="mt-6 text-center">
            <Link
              to="/provider/venues/new"
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create Your First Venue
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && venues.length > 0 && (
        <div className="space-y-4">
          {venues.map((venue) => (
            <ProviderVenueCard
              key={venue?._id}
              venue={venue}
              onToggleStatus={handleToggleStatus}
              isToggling={togglingVenueId === venue._id}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default MyVenues;
