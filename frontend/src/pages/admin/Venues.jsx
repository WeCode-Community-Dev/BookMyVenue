import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAdminVenues, activateAdminVenue, deactivateAdminVenue, } from "../../services/adminService";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminSearchInput from "../../components/admin/AdminSearchInput";
import AdminTextFilter from "../../components/admin/AdminTextFilter";
import AdminFilterSelect from "../../components/admin/AdminFilterSelect";
import AdminTable from "../../components/admin/AdminTable";
import AdminPagination from "../../components/admin/AdminPagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/profile/StatusBadge";
import { formatBookingPriceDisplay } from "../../utils/formatPrice";
import { getVenueCoverUrl } from "../../utils/venue";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const AdminVenues = () => {
  const [venues, setVenues] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [city, setCity] = useState("");
  const [debouncedCity, setDebouncedCity] = useState("");
  const [isActive, setIsActive] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(city);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [city]);

  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminVenues({
        page,
        limit,
        search: debouncedSearch,
        city: debouncedCity,
        isActive,
      });

      if (data.success) {
        setVenues(data.data ?? []);
        setCount(data.count ?? 0);
      } else {
        setVenues([]);
        setCount(0);
        setError(data.message || "Failed to load venues.");
      }
    } catch (err) {
      setVenues([]);
      setCount(0);
      setError(
        err.response?.data?.message ||
        "Unable to load venues. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, debouncedCity, isActive]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const handleToggleStatus = async () => {
    if (!confirmAction) return;

    try {
      setActionLoading(true);
      const { venue, action } = confirmAction;
      const data =
        action === "activate"
          ? await activateAdminVenue(venue._id)
          : await deactivateAdminVenue(venue._id);

      if (data.success) {
        toast.success(data.message || "Venue status updated.");
        setConfirmAction(null);
        fetchVenues();
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

  return (
    <>
      <AdminPageHeader
        title="Venues"
        description="View and moderate all platform venues."
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <AdminSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search title, city, or address"
          className="lg:flex-1"
        />
        <div className="flex flex-wrap gap-3">
          <AdminTextFilter
            label="City"
            value={city}
            onChange={setCity}
            placeholder="Filter by city"
          />
          <AdminFilterSelect
            label="Status"
            value={isActive}
            onChange={(value) => {
              setIsActive(value);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      {loading && <Loader label="Loading venues..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchVenues} />
      )}

      {!loading && !error && venues.length === 0 && (
        <EmptyState
          title="No venues found"
          description="Try adjusting your search or filters."
        />
      )}

      {!loading && !error && venues.length > 0 && (
        <AdminTable>
          <div className="divide-y divide-gray-100">
            {venues.map((venue) => {
              const coverUrl = getVenueCoverUrl(venue);
              const owner = venue.ownerId;

              return (
                <div
                  key={venue._id}
                  className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center"
                >
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={venue.title ? `${venue.title} cover` : "Venue cover"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/admin/venues/${venue._id}`}
                      className="text-sm font-medium text-gray-900 hover:text-red-600"
                    >
                      {venue.title}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {venue.city || "—"} · Owner:{" "}
                      {owner?.name || "Unknown"}
                    </p>
                    <p className="mt-1 text-sm font-medium text-red-600">
                      {formatBookingPriceDisplay(venue.price)}
                    </p>
                  </div>

                  <StatusBadge
                    label={venue.isActive ? "Active" : "Inactive"}
                    tone={venue.isActive ? "success" : "danger"}
                  />

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/admin/venues/${venue._id}`}
                      className="inline-flex min-h-8 items-center rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      View
                    </Link>
                    {venue.isActive ? (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                          setConfirmAction({ venue, action: "deactivate" })
                        }
                        className="inline-flex min-h-8 items-center rounded-lg border border-red-200 bg-red-50/50 px-3 text-xs font-medium text-red-800 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                          setConfirmAction({ venue, action: "activate" })
                        }
                        className="inline-flex min-h-8 items-center rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 text-xs font-medium text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <AdminPagination
            page={page}
            limit={limit}
            count={count}
            onPageChange={setPage}
          />
        </AdminTable>
      )}

      <ConfirmModal
        open={Boolean(confirmAction)}
        title={
          confirmAction?.action === "activate"
            ? "Activate venue"
            : "Deactivate venue"
        }
        message={
          confirmAction
            ? `Are you sure you want to ${confirmAction.action} ${confirmAction.venue.title}?`
            : ""
        }
        confirmLabel={
          confirmAction?.action === "activate" ? "Activate" : "Deactivate"
        }
        isLoading={actionLoading}
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
};

export default AdminVenues;
