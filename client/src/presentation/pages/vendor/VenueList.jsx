import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
import VenueHeader from "@/presentation/components/vendor/venues/VenueHeader";
import VenueFilters from "@/presentation/components/vendor/venues/VenueFilters";
import VenueGrid from "@/presentation/components/vendor/venues/VenueGrid";
import DeleteVenueDialog from "@/presentation/components/vendor/venues/DeleteVenueDialog";

import { ROUTES } from "@/constants/routes";

import {
  fetchVenues,
  deleteVenue,
} from "@/redux/slices/VendorVenueSlice";

const initialFilters = {
  search: "",
  status: "",
  category: "",
  priceType: "",
  minPrice: "",
  maxPrice: "",
  capacityType: "",
  capacity: "",
  rating: "",
  page: 1,
  limit: 20,
};

const VenueList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    venues,
    loading,
    error,
  } = useSelector((state) => state.vendorVenue);

  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState("grid");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  const queryParams = useMemo(() => {
    const sanitized = { ...filters };

    delete sanitized.status;

    Object.keys(sanitized).forEach((key) => {
      if (
        sanitized[key] === "" ||
        sanitized[key] === null ||
        sanitized[key] === undefined
      ) {
        delete sanitized[key];
      }
    });

    return sanitized;
  }, [filters]);

  useEffect(() => {
    dispatch(fetchVenues(queryParams));
  }, [dispatch, queryParams]);

  const handleViewVenue = (venueId) => {
    navigate(
      ROUTES.VENDOR.VENUE_DETAILS.replace(
        ":venueId",
        venueId
      )
    );
  };

  const handleEditVenue = (venueId) => {
    navigate(
      ROUTES.VENDOR.EDIT_VENUE.replace(
        ":venueId",
        venueId
      )
    );
  };

  const handleDeleteVenue = (venueId) => {
    setSelectedVenueId(venueId);
    setDeleteOpen(true);
  };

  const confirmDeleteVenue = async () => {
    try {
      await dispatch(
        deleteVenue(selectedVenueId)
      ).unwrap();

      toast.success(
        "Venue deleted successfully"
      );

      setDeleteOpen(false);
      setSelectedVenueId(null);

      dispatch(fetchVenues(queryParams));
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : err?.message || "Failed to delete venue"
      );
    }
  };

  const visibleVenues = useMemo(() => {
    if (!filters.status) {
      return venues;
    }

    return venues.filter(
      (venue) =>
        venue.approvalStatus === filters.status
    );
  }, [venues, filters.status]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <VendorSidebar />

      <div className="flex-1">
        <VendorNavbar />

        <main className="p-6">
          <VenueHeader />

          <VenueFilters
            filters={filters}
            onChange={setFilters}
            onAddVenue={() =>
              navigate(ROUTES.VENDOR.ADD_VENUE)
            }
            onToggleView={setViewMode}
            viewMode={viewMode}
          />

          {error && (
            <p className="my-4 text-sm text-red-500">
              {typeof error === "string"
                ? error
                : error?.message || "Something went wrong"}
            </p>
          )}

          {loading && (
            <p className="my-4 text-sm text-gray-500">
              Loading venues...
            </p>
          )}

          {!loading && !error && (
            <p className="my-6 font-medium">
              {visibleVenues.length} venue
              {visibleVenues.length === 1
                ? ""
                : "s"}{" "}
              found
            </p>
          )}

          <VenueGrid
            venues={visibleVenues}
            loading={loading}
            error={error}
            viewMode={viewMode}
            onView={handleViewVenue}
            onEdit={handleEditVenue}
            onDelete={handleDeleteVenue}
          />

          <DeleteVenueDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={confirmDeleteVenue}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
};

export default VenueList;