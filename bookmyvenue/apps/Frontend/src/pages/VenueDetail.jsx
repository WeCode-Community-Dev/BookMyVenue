import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getVenueById } from "../api/venues";
import { getAvailability } from "../api/availability";
import { createBooking } from "../api/bookings";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function VenueDetail() {
  const navigate = useNavigate();
  const { venueId } = useParams();

  const { token, login } = useAuth();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [selectedDate, setSelectedDate] = useState("");
  const [availabilityData, setAvailabilityData] = useState(null);
  const [selectedSlotIds, setSelectedSlotIds] = useState([]);
  const [bookingSummary, setBookingSummary] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(false);

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

  function getTodayDate() {
    return new Date().toISOString().split("T")[0];
  }

  async function handleDateChange(event) {
    const date = event.target.value;
    setSelectedDate(date);
    setSelectedSlotIds([]);
    setAvailabilityData(null);
    setBookingSummary(null);
    setBookingError(null);

    if (!date) return;

    try {
      setBookingLoading(true);
      const data = await getAvailability(
        venueId,
        date
      );

      console.log("Availability:", data);

      setAvailabilityData(data[0]);
    } catch (err) {
      setBookingError("Failed to load availability");
    } finally {
      setBookingLoading(false);
    }
  }

  function toggleSlot(slot) {
    if (slot.is_booked) return;

    if (availabilityData?.booking_type === "daily") {
      // Daily: only one slot can be selected
      setSelectedSlotIds(
        selectedSlotIds.includes(slot.id) ? [] : [slot.id]
      );
      return;
    }

    if (selectedSlotIds.includes(slot.id)) {
      setSelectedSlotIds(selectedSlotIds.filter((id) => id !== slot.id));
    } else {
      setSelectedSlotIds([...selectedSlotIds, slot.id]);
    }
  }

  useEffect(() => {
    if (selectedSlotIds.length === 0 || !availabilityData || !venue) {
      setBookingSummary(null);
      return;
    }

    let basePrice = 0;
    if (availabilityData.booking_type === "hourly") {
      basePrice = (venue.hourly_price || 0) * selectedSlotIds.length;
    } else if (availabilityData.booking_type === "daily") {
      basePrice = (venue.daily_price || 0) * selectedSlotIds.length;
    }

    const taxAmount = basePrice * 0.12;
    const platformFee = 100;

    setBookingSummary({
      base_price: basePrice,
      tax_amount: taxAmount,
      platform_fee: platformFee,
      total_amount: basePrice + taxAmount + platformFee,
    });
  }, [selectedSlotIds, availabilityData, venue]);

  async function submitBooking(authToken) {
    const tokenToUse = authToken || token;
    if (!tokenToUse) {
      setShowLoginModal(true);
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(null);

      await createBooking(
        {
          venue_id: venue.id,
          availability_ids: selectedSlotIds,
        },
        tokenToUse
      );

      setBookingSuccess(true);
      setSelectedSlotIds([]);
      setBookingSummary(null);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setBookingError(err.response?.data?.detail || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  }

  function handleBookNow() {
    if (selectedSlotIds.length === 0) return;

    if (!token) {
      setPendingBooking(true);
      setShowLoginModal(true);
      return;
    }

    submitBooking();
  }

  async function handleLoginSubmit(e) {

        e.preventDefault();

        setLoginError("");



        if (!loginEmail || !loginPassword) {

            setLoginError(
                "Please enter email and password"
            );

            return;

        }



        try {


            setLoginLoading(true);



            const formData = new URLSearchParams();


            formData.append(
                "username",
                loginEmail
            );


            formData.append(
                "password",
                loginPassword
            );



            const res = await api.post(
                "/api/auth/login",
                formData,
                {
                    headers: {
                        "Content-Type":
                        "application/x-www-form-urlencoded",
                    },
                }
            );



            const newToken =
                res.data?.access_token ||
                res.data?.token;



            if (!newToken) {

                setLoginError(
                    "Login failed"
                );

                return;

            }




            login(newToken);



            setShowLoginModal(false);


            setLoginEmail("");

            setLoginPassword("");




            if (
                pendingBooking &&
                selectedSlotIds.length > 0
            ) {

                setPendingBooking(false);

                await submitBooking(newToken);

            }



        }
        catch(err) {


            setLoginError(
                err.response?.data?.detail ||
                "Invalid credentials"
            );


        }
        finally {


            setLoginLoading(false);


        }

    }

  function closeLoginModal() {
    setShowLoginModal(false);
    setPendingBooking(false);
    setLoginError("");
  }

  function formatTime(time) {
    if (!time) return "";

    return time.slice(0,5);
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

              <label className="mt-5 block text-sm font-semibold text-gray-700">
                Select date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={getTodayDate()}
                onChange={handleDateChange}
                className="mt-1.5 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
              />

              {!selectedDate && (
                <p className="mt-3 text-sm text-gray-500">
                  Select a date to see available slots
                </p>
              )}

              {bookingLoading && !availabilityData && (
                <p className="mt-3 text-sm text-gray-600">Loading slots...</p>
              )}

              {availabilityData && availabilityData.slots?.length === 0 && (
                <p className="mt-3 text-sm text-gray-500">No slots available for this date</p>
              )}

              {availabilityData?.slots?.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {availabilityData.booking_type === "hourly" ? "Available hours" : "Available"}
                  </p>
                  {availabilityData.slots.map((slot) => {
                    const isSelected = selectedSlotIds.includes(slot.id);
                    return (
                      <button
                        key={slot.id}
                        disabled={slot.is_booked}
                        onClick={() => toggleSlot(slot)}
                        className={`w-full rounded-xl border p-3 text-sm font-medium transition ${
                          slot.is_booked
                            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
                            : isSelected
                            ? "border-red-600 bg-red-600 text-white shadow-sm"
                            : "border-gray-200 bg-white text-gray-800 hover:border-red-300 hover:bg-red-50"
                        }`}
                      >
                        {availabilityData.booking_type === "hourly"
                          ? `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`
                          : `Full Day - ${selectedDate}`}
                      </button>
                    );
                  })}
                </div>
              )}

              {bookingSummary && (
                <div className="mt-5 space-y-1.5 rounded-xl bg-gray-50 p-4 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Base price</span>
                    <span>₹{bookingSummary.base_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>GST (12%)</span>
                    <span>₹{bookingSummary.tax_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Platform fee</span>
                    <span>₹{bookingSummary.platform_fee.toFixed(2)}</span>
                  </div>
                  <hr className="my-2 border-gray-200" />
                  <div className="flex justify-between text-base font-bold text-black">
                    <span>Total</span>
                    <span className="text-red-600">₹{bookingSummary.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                disabled={selectedSlotIds.length === 0 || bookingLoading}
                onClick={handleBookNow}
                className="mt-5 w-full rounded-full bg-red-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bookingLoading ? "Processing..." : "Book Now"}
              </button>

              {bookingSuccess && (
                <p className="mt-3 text-sm font-medium text-green-600">
                  Booking confirmed! Redirecting to your dashboard...
                </p>
              )}

              {bookingError && (
                <p className="mt-3 text-sm font-medium text-red-600">{bookingError}</p>
              )}

              <p className="mt-3 text-center text-xs text-gray-500">
                You won't be charged yet
              </p>
            </div>
          </aside>
        </section>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={closeLoginModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-black">Login to Book</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Sign in to complete your reservation.
                </p>
              </div>
              <button
                aria-label="Close"
                onClick={closeLoginModal}
                className="text-gray-400 hover:text-gray-700"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="mt-5 space-y-3">
              <input
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                placeholder="Username or email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoFocus
              />
              <input
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                placeholder="Password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              {loginError && (
                <p className="text-sm font-medium text-red-600">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-full bg-red-600 p-3 font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
              >
                {loginLoading ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              New to BookMyVenue?{" "}
              <span
                className="cursor-pointer font-semibold text-red-600 hover:underline"
                onClick={() => {
                  closeLoginModal();
                  navigate("/register");
                }}
              >
                Register here
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VenueDetail;
