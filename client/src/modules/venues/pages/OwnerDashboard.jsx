import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import VenueSetupModal from "../components/VenueSetupModal";
import { fetchMyVenuesApi } from "../api/venue.api";

const OwnerDashboard = () => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venues, setVenues] = useState([]);

  const location = useLocation();

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const response = await fetchMyVenuesApi();

      const data = response.data;

      setVenues(data);

      /*
       * Open automatically ONLY when redirected
       * immediately after signup.
       */
      if (location.state?.openVenueSetup) {
        const incompleteVenue = data.find(
          (venue) =>
            !venue.address ||
            !venue.description ||
            !venue.capacity ||
            !venue.price ||
            venue.images.length === 0
        );

        if (incompleteVenue) {
          setSelectedVenue(incompleteVenue);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        My Venues
      </h1>

      <div className="space-y-4">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="
              border
              rounded-xl
              p-4
              flex
              justify-between
              items-center
            "
          >
            <div>
              <h2 className="font-semibold">
                {venue.name}
              </h2>

              <p className="text-gray-500">
                {venue.city}
              </p>
            </div>

            <button
              onClick={() => setSelectedVenue(venue)}
              className="btn-primary"
            >
              Complete Setup
            </button>
          </div>
        ))}
      </div>

      {selectedVenue && (
        <VenueSetupModal
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;