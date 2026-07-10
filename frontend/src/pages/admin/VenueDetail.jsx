import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getAdminVenueById, activateAdminVenue, deactivateAdminVenue, } from "../../services/adminService";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminDetailRow from "../../components/admin/AdminDetailRow";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/profile/StatusBadge";
import { formatBookingPriceDisplay } from "../../utils/formatPrice";
import { getCategoryLabel } from "../../utils/venueFilters";
import { getVenueCoverUrl } from "../../utils/venue";

const AdminVenueDetail = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchVenue = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminVenueById(id);

      if (data.success) {
        setVenue(data.data);
      } else {
        setVenue(null);
        setError(data.message || "Venue not found.");
      }
    } catch (err) {
      setVenue(null);
      setError(
        err.response?.data?.message ||
        "Unable to load venue. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenue();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!confirmAction) return;

    try {
      setActionLoading(true);
      const data =
        confirmAction === "activate"
          ? await activateAdminVenue(id)
          : await deactivateAdminVenue(id);

      if (data.success) {
        toast.success(data.message || "Venue status updated.");
        setConfirmAction(null);
        fetchVenue();
      } else {
        toast.error(data.message || "Failed to update venue.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Unable to update venue. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const owner = venue?.ownerId;
  const coverUrl = venue ? getVenueCoverUrl(venue) : null;

  return (
    <>
      <div className="mb-4">
        <Link
          to="/admin/venues"
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          ← Back to venues
        </Link>
      </div>

      {loading && <Loader label="Loading venue..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchVenue} />
      )}

      {!loading && !error && venue && (
        <>
          <AdminPageHeader title={venue.title} description={venue.address}>
            {venue.isActive ? (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setConfirmAction("deactivate")}
                className="inline-flex min-h-9 items-center rounded-lg border border-red-200 bg-red-50/50 px-4 text-sm font-medium text-red-800 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Deactivate
              </button>
            ) : (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setConfirmAction("activate")}
                className="inline-flex min-h-9 items-center rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 text-sm font-medium text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Activate
              </button>
            )}
          </AdminPageHeader>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5">
              {coverUrl && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <img
                    src={coverUrl}
                    alt={venue.title}
                    className="h-56 w-full object-cover sm:h-72"
                  />
                </div>
              )}

              <section className="rounded-xl border border-gray-200/80 bg-white p-5 ring-1 ring-gray-100/80">
                <h2 className="text-base font-semibold text-gray-900">
                  Description
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {venue.description}
                </p>
              </section>

              {venue.amenities?.length > 0 && (
                <section className="rounded-xl border border-gray-200/80 bg-white p-5 ring-1 ring-gray-100/80">
                  <h2 className="text-base font-semibold text-gray-900">
                    Amenities
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {venue.amenities.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside className="space-y-5">
              <section className="rounded-xl border border-gray-200/80 bg-white p-5 ring-1 ring-gray-100/80">
                <h2 className="text-base font-semibold text-gray-900">Details</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <AdminDetailRow align="start"
                    label="Status"
                    value={
                      <StatusBadge
                        label={venue.isActive ? "Active" : "Inactive"}
                        tone={venue.isActive ? "success" : "danger"}
                      />
                    }
                  />
                  <AdminDetailRow align="start"
                    label="Price"
                    value={formatBookingPriceDisplay(venue.price)}
                  />
                  <AdminDetailRow align="start" label="Category" value={venue.category ? getCategoryLabel(venue.category) : "—"} />
                  <AdminDetailRow align="start" label="Capacity" value={venue.capacity ?? "—"} />
                  <AdminDetailRow align="start"
                    label="Location"
                    value={[venue.city, venue.state].filter(Boolean).join(", ") || "—"}
                  />
                </dl>
              </section>

              {owner && (
                <section className="rounded-xl border border-gray-200/80 bg-white p-5 ring-1 ring-gray-100/80">
                  <h2 className="text-base font-semibold text-gray-900">Owner</h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <AdminDetailRow align="start" label="Name" value={owner.name} />
                    <AdminDetailRow align="start" label="Email" value={owner.email} />
                    <AdminDetailRow align="start" label="Phone" value={owner.phone || "—"} />
                  </dl>
                  <Link
                    to={`/admin/users/${owner._id}`}
                    className="mt-4 inline-flex text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    View owner profile →
                  </Link>
                </section>
              )}
            </aside>
          </div>
        </>
      )}

      <ConfirmModal
        open={Boolean(confirmAction)}
        title={
          confirmAction === "activate" ? "Activate venue" : "Deactivate venue"
        }
        message={
          venue
            ? `Are you sure you want to ${confirmAction} ${venue.title}?`
            : ""
        }
        confirmLabel={confirmAction === "activate" ? "Activate" : "Deactivate"}
        isLoading={actionLoading}
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
};

export default AdminVenueDetail;
