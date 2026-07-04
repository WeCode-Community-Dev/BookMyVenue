import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
import VenueHeader from "@/presentation/components/vendor/VenueHeader";
import VenueFilters from "@/presentation/components/vendor/VenueFilters";
import VenueGrid from "@/presentation/components/vendor/VenueGrid";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constatnts/apiRoutes";
import { ROUTES } from "@/constatnts/routes";

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
  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();

  const handleEditVenue = (venueId) => {
    navigate(ROUTES.VENDOR.EDIT_VENUE.replace(":venueId", venueId));
  };

  const queryParams = useMemo(() => {
    const sanitized = { ...filters };

    delete sanitized.status;

    Object.keys(sanitized).forEach((key) => {
      if (sanitized[key] === "" || sanitized[key] === null || sanitized[key] === undefined) {
        delete sanitized[key];
      }
    });
    return sanitized;
  }, [filters]);

  const visibleVenues = useMemo(() => {
    if (!filters.status) {
      return venues;
    }

    return venues.filter((venue) => venue.approvalStatus === filters.status);
  }, [venues, filters.status]);

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(API_ROUTES.VENDOR.VENUES, {
          params: queryParams,
        });
        const payload = response?.data?.data || {};
        setVenues(payload.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load venues.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [queryParams]);

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <VendorSidebar />

      <div className="flex-1">
        <VendorNavbar />

        <main className="p-6">
          <VenueHeader />
          <VenueFilters
            filters={filters}
            onChange={setFilters}
            onAddVenue={() => navigate(ROUTES.VENDOR.ADD_VENUE)}
            onToggleView={setViewMode}
            viewMode={viewMode}
          />

          {error && <p className="my-4 text-sm text-red-500">{error}</p>}
          {loading && <p className="my-4 text-sm text-gray-500">Loading venues...</p>}

          {!loading && !error && (
            <p className="my-6 font-medium">
              {visibleVenues.length} venue{visibleVenues.length === 1 ? "" : "s"} found
            </p>
          )}

          <VenueGrid venues={visibleVenues} loading={loading} error={error} viewMode={viewMode} onEdit={handleEditVenue} />
        </main>
      </div>
    </div>
  );
};

export default VenueList;