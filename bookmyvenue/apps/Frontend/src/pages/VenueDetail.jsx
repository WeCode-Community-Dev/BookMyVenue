import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getVenueById } from "../api/venues";

function VenueDetail() {
  const navigate = useNavigate();
  const { venueId } = useParams();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function loadVenue() {
      try {
        setLoading(true);
        setError("");
        const data = await getVenueById(venueId);
        if (!data) {
          setError("Venue not found");
          return;
        }
        setVenue(data);
      } catch (err) {
        setError("Venue not found");
      } finally {
        setLoading(false);
      }
    }
    if (venueId) loadVenue();
  }, [venueId]);

  function getImageUrl(image) {
    if (typeof image === "string") return image;
    return image?.url || image?.image_url || "";
  }

  function goToPreviousImage() {
    if (!venue?.images?.length) return;
    setCurrentImageIndex((i) => (i === 0 ? venue.images.length - 1 : i - 1));
  }

  function goToNextImage() {
    if (!venue?.images?.length) return;
    setCurrentImageIndex((i) => (i === venue.images.length - 1 ? 0 : i + 1));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-3 text-gray-600">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          Loading venue...
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <h1 className="text-3xl font-bold text-black">Venue not found</h1>
        <p className="text-gray-600">The venue you're looking for doesn't exist or was removed.</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const images = venue.images || [];
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;
  const currentImage = hasImages ? getImageUrl(images[currentImageIndex]) : "";
  const amenitiesList = venue.amenities
    ? venue.amenities.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back nav */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-red-600"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </button>

        {/* Image Carousel */}
        <section className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          {hasImages && currentImage ? (
            <img
              src={currentImage}
              alt={venue.name}
              className="h-[280px] w-full object-cover sm:h-[420px] lg:h-[500px]"
            />
          ) : (
            <div className="flex h-[280px] w-full items-center justify-center bg-gray-100 text-gray-500 sm:h-[420px] lg:h-[500px]">
              No images available
            </div>
          )}

          {hasMultipleImages && (
            <>
              <button
                onClick={goToPreviousImage}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-md transition hover:bg-white hover:text-red-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={goToNextImage}
                aria-label="Next image"
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-md transition hover:bg-white hover:text-red-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          {hasImages && (
            <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </section>

        {/* Content grid */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Overview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
                    {venue.name}
                  </h1>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
                    <svg className="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {venue.address_line}, {venue.city} - {venue.pincode}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11a4 4 0 10-8 0 4 4 0 008 0zM2 20a8 8 0 1116 0H2z" />
                  </svg>
                  {venue.capacity} people
                </span>
              </div>

              <p className="mt-5 text-[15px] leading-relaxed text-gray-700">
                {venue.description || "No description available"}
              </p>

              <button
                disabled
                title="Coming Soon"
                className="mt-6 inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-gray-500"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Find Distance
              </button>
            </div>

            {/* Pricing */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-black">Pricing</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {venue.supports_hourly && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Hourly</p>
                    <p className="mt-1 text-2xl font-extrabold text-red-600">
                      ₹{venue.hourly_price}
                      <span className="ml-1 text-sm font-medium text-gray-500">/hour</span>
                    </p>
                  </div>
                )}
                {venue.supports_daily && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Daily</p>
                    <p className="mt-1 text-2xl font-extrabold text-red-600">
                      ₹{venue.daily_price}
                      <span className="ml-1 text-sm font-medium text-gray-500">/day</span>
                    </p>
                  </div>
                )}
                {!venue.supports_hourly && !venue.supports_daily && (
                  <p className="text-gray-600">Pricing not available</p>
                )}
              </div>
            </div>

            {/* Amenities */}
            {amenitiesList.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                <h2 className="text-xl font-bold text-black">Amenities</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {amenitiesList.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700"
                    >
                      <svg className="h-3.5 w-3.5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation Policy */}
            {venue.cancellation_policy && venue.cancellation_policy.trim() !== "" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                <h2 className="text-xl font-bold text-black">Cancellation Policy</h2>
                <p className="mt-3 leading-relaxed text-gray-700">{venue.cancellation_policy}</p>
              </div>
            )}
          </div>

          {/* Right column - Booking panel */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-black">Book This Venue</h2>
              <p className="mt-1 text-sm text-gray-600">Reserve your date in just a few clicks.</p>

              <div className="mt-5 space-y-3 rounded-xl bg-gray-50 p-4">
                {venue.supports_hourly && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-gray-600">Hourly</span>
                    <span className="text-lg font-bold text-black">
                      ₹{venue.hourly_price}
                      <span className="ml-0.5 text-xs font-medium text-gray-500">/hr</span>
                    </span>
                  </div>
                )}
                {venue.supports_daily && (
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-gray-600">Daily</span>
                    <span className="text-lg font-bold text-black">
                      ₹{venue.daily_price}
                      <span className="ml-0.5 text-xs font-medium text-gray-500">/day</span>
                    </span>
                  </div>
                )}
              </div>

              <button
                disabled
                className="mt-5 w-full cursor-not-allowed rounded-full bg-red-600 px-5 py-3 font-semibold text-white opacity-70"
              >
                Booking coming soon
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                You won't be charged yet
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

export default VenueDetail;
