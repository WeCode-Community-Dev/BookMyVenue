import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchVenueByIdApi } from "../api/venue.api";
import MainLayout from "../../common/MainLayout";

const VenueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    loadVenue();
  }, [id]);

  const loadVenue = async () => {
    try {
      const response = await fetchVenueByIdApi(id);
      setVenue(response.data);
    } catch {
      setVenue(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-[68px] min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading venue...</p>
      </div>
    );
  }
//   console.log(venue);
  if (!venue) {
    return (
      <div className="pt-[68px] min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500 text-sm">Venue not found.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          Go back
        </button>
      </div>
    );
  }

  const images = venue.images?.length ? venue.images : [];

  return (
    <MainLayout>
      <div className="pt-[68px] min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-[6%] py-8">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6"
          >
            
            🡨 Back
          </button>

          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            {/* LEFT */}
            <div>
              {/* Gallery */}
              {images.length > 0 ? (
                <div className="mb-6">
                  {/* Main image */}
                  <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-3">
                    <img
                      src={images[activeImg]?.url || images[activeImg]}
                      alt={`Venue image ${activeImg + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.slice(0, 5).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`flex-shrink-0 w-[80px] h-[56px] rounded-lg overflow-hidden border-2 transition-colors ${
                          activeImg === i
                            ? "border-gray-900"
                            : "border-transparent opacity-60 hover:opacity-90"
                        }`}
                      >
                        <img
                          src={img?.url || img}
                          alt={`Thumbnail ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[16/9] rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                  <span className="text-gray-300 text-sm">
                    No images available
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                  {venue.name}
                </h1>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 mt-1 bg-red-300`}
                >
                  {venue.type}
                </span>
              </div>

              {/* Location */}
              <p className="text-sm text-gray-400 mb-5 flex items-center gap-1">
                📍{venue.address} ,{venue.city}
              </p>

              {/* Description */}
              {venue.description && (
                <div className="mb-8">
                  <h2 className="text-sm font-medium text-gray-900 mb-2">
                    About this venue
                  </h2>
                  <p className="text-sm text-gray-500 leading-[1.8]">
                    {venue.description}
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT — Booking card */}
            <div className="lg:sticky lg:top-[88px] self-start">
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
                {/* Price */}
                {/* <div className="mb-5">
                  <span className="text-2xl font-semibold text-red-600">
                    Book Now
                  </span>
                </div> */}

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    {
                      label: "Capacity",
                      value: venue.capacity ?? "—",
                      sub: "/ guests",
                    },
                    {
                      label: "Price",
                      value: venue.price
                        ? `Rs.${venue.price.toLocaleString("en-IN")}`
                        : "—",
                      sub: "/ hr",
                    },
                  ].map(({ label, value, sub }) => (
                    <div
                      key={label}
                      className="bg-gray-50 rounded-xl px-4 py-3"
                    >
                      <p className="text-[0.7rem] text-gray-400 mb-0.5">
                        {label}
                      </p>
                      <div className="flex items-end gap-1">
                        <p className="text-2xl font-semibold text-gray-900">
                          {value}
                        </p>
                        <span className="text-sm text-gray-400 mb-0.5">
                          {sub}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status gate */}
                {venue.status === "PENDING" ? (
                  <div className="text-center text-sm text-yellow-600 bg-yellow-50 rounded-xl py-3 px-4">
                    This venue is pending approval and can't be booked yet.
                  </div>
                ) : (
                  <button
                    className="btn-primary w-full"
                    onClick={() => navigate(`/venues/${venue.id}/book`)}
                  >
                    Book now
                  </button>
                )}

                {/* Owner info */}
                {venue.owner && (
                  <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                      {venue.owner.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Hosted by</p>
                      <p className="text-sm font-medium text-gray-700">
                        {venue.owner.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VenueDetailsPage;
