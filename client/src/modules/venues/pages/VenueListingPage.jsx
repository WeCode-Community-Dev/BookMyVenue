import { useNavigate } from "react-router-dom";
import MainLayout from "../../common/MainLayout";

import VenueCard from "../components/VenueCard";

import { useVenues } from "../hooks/useVenues";

const VenueListingPage = () => {
  const { venues, loading } = useVenues();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div
        className="
               w-full
               mx-auto
               px-5
               py-32
               bg-white
               
            "
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6"
        >
          🡨 Back
        </button>
        {loading ? (
          <p>Loading venues...</p>
        ) : venues.length === 0 ? (
          <p>No venues available.</p>
        ) : (
          <div
            className="
                     grid
                     grid-cols-1
                     sm:grid-cols-2
                     lg:grid-cols-3
                     gap-5
                  "
          >
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default VenueListingPage;
