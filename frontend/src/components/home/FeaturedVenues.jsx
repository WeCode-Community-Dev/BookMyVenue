import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getAllVenues } from "../../services/venueService";
import FeaturedVenueCard from "./FeaturedVenueCard";
import VenueCardGrid from "../venues/VenueCardGrid";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";

const FEATURED_LIMIT = 6;

const FeaturedVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeaturedVenues = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllVenues();

      if (data.success) {
        setVenues((data.data ?? []).slice(0, FEATURED_LIMIT));
      } else {
        setVenues([]);
        setError(data.message || "Failed to load featured venues.");
      }
    } catch (err) {
      setVenues([]);
      setError(
        err.response?.data?.message ||
          "Unable to load featured venues. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedVenues();
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:py-14 lg:py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-red-600/90">
          Curated picks
        </p>

        <h2 className="mt-4 text-balance">
          <span className="block text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Featured Venues
          </span>
          <span className="mt-2 block text-base font-normal leading-relaxed text-gray-500 sm:text-lg">
            Hand-picked spaces for weddings, corporate events, and celebrations
          </span>
        </h2>

        <div
          className="mx-auto mt-6 flex items-center justify-center gap-3"
          aria-hidden="true"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-red-200/80 sm:w-14" />
          <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-red-200/80 sm:w-14" />
        </div>
      </div>

      {loading && <Loader label="Loading featured venues..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchFeaturedVenues} />
      )}

      {!loading && !error && venues.length === 0 && (
        <div className="text-center">
          <EmptyState
            title="No venues available yet"
            description="New venues are added regularly. Check back soon or browse when listings go live."
          />

          <Link
            to="/venues"
            className="mt-6 inline-block text-sm font-medium text-red-600 transition-colors duration-200 hover:text-red-700 hover:underline"
          >
            Go to venue listings
          </Link>
        </div>
      )}

      {!loading && !error && venues.length > 0 && (
        <>
          <VenueCardGrid>
            {venues.map((venue) => (
              <FeaturedVenueCard key={venue._id} venue={venue} />
            ))}
          </VenueCardGrid>

          <div className="mt-10 text-center sm:mt-12">
            <Link
              to="/venues"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-gray-200/90 bg-white px-7 py-3 text-sm font-medium text-gray-800 shadow-sm transition-all duration-300 hover:border-red-200 hover:bg-red-50/50 hover:text-red-700 sm:px-8 sm:text-base"
            >
              View all venues
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedVenues;
