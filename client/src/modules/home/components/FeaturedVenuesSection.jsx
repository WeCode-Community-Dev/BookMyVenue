import { useEffect, useState } from "react";
import { fetchVenuesApi } from "../../venues/api/venue.api";
import VenueCard from "../../venues/components/VenueCard";
import { useNavigate } from "react-router-dom";

const FeaturedVenuesSection = () => {
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const response = await fetchVenuesApi();

      setVenues(response.data.slice(0, 6));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="py-14 bg-gray-50 px-5 sm:px-8 lg:px-[6%]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-gray-400 uppercase">
              Handpicked for you
            </p>

            <h2 className="text-3xl font-bold">Featured Venues</h2>
          </div>
          <button
            onClick={() => {
              navigate("/venues");
              setMenuOpen(false);
            }}
            className="btn-outline !py-[9px] !px-5 !text-[0.88rem] !rounded-[10px]"
          >
            Explore More
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVenuesSection;
