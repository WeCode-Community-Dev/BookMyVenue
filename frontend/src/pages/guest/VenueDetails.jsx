import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getPublicVenueById } from "../../services/venueService";
import { getVenueAvailability } from "../../services/availabilityService";
import { createOrder, verifyPayment } from "../../services/paymentService";
import useRazorpay from "../../hooks/useRazorpay";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import VenueImageGallery from "../../components/venue-details/VenueImageGallery";
import VenueQuickFacts from "../../components/venue-details/VenueQuickFacts";
import VenueBookingCard, {
  BookingSuccessCard,
} from "../../components/venue-details/VenueBookingCard";
import VenueAmenities from "../../components/venue-details/VenueAmenities";
import VenueLocation from "../../components/venue-details/VenueLocation";
import VenueRules from "../../components/venue-details/VenueRules";
import VenueHostedBy from "../../components/venue-details/VenueHostedBy";
import VenueSlotCard from "../../components/venue-details/VenueSlotCard";
import MobileBookingBar from "../../components/venue-details/MobileBookingBar";
import { getVenueImages } from "../../utils/venue";
import {
  buildBookingPayload,
  validateBookingPayload,
} from "../../utils/booking";
import {
  formatSlotDate,
  formatSlotDateCompact,
  toDateKey,
} from "../../utils/formatDate";
import {
  clearBookingContext,
  filterCustomerBookableSlots,
  findSlotById,
  getCustomerAvailabilityEmptyState,
  isSlotStillBookable,
  loadBookingContext,
  saveBookingContext,
} from "../../utils/customerSlots";
import { groupSlotsByDate } from "../../utils/predefinedSlots";

const AlertBox = ({ variant, title, children }) => {
  const styles =
    variant === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <div
      role={variant === "success" ? "status" : "alert"}
      className={`rounded-xl border px-4 py-3 text-sm ${styles}`}
    >
      <p className="font-medium">{title}</p>
      {children && <div className="mt-1 opacity-90">{children}</div>}
    </div>
  );
};

const VenueDetails = () => {
  const { id: venueId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { openCheckout, isRazorpayConfigured } = useRazorpay();
  const restoredContextRef = useRef(false);

  const [venue, setVenue] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [slotsError, setSlotsError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [confirmedSlotSnapshot, setConfirmedSlotSnapshot] = useState(null);
  const [slotUnavailableMessage, setSlotUnavailableMessage] = useState("");

  const fetchAvailability = async () => {
    if (!venueId) return;

    try {
      setSlotsError("");
      const availabilityData = await getVenueAvailability(venueId);

      if (availabilityData.success) {
        setSlots(availabilityData.data ?? []);
      } else {
        setSlots([]);
        setSlotsError(
          availabilityData.message || "Unable to load availability."
        );
      }
    } catch (err) {
      setSlots([]);
      setSlotsError(
        err.response?.data?.message ||
          "Unable to load availability. Please try again later."
      );
    }
  };

  const fetchVenueDetails = async ({ preserveSelection = false } = {}) => {
    if (!venueId) {
      setVenue(null);
      setSlots([]);
      setLoading(false);
      setError("Invalid venue link.");
      return;
    }

    setLoading(true);
    setError("");
    setSlotsError("");
    if (!preserveSelection) {
      setSelectedSlot(null);
      setSlotUnavailableMessage("");
    }
    setPaymentError("");

    try {
      const venueData = await getPublicVenueById(venueId);

      if (!venueData.success) {
        setVenue(null);
        setSlots([]);
        setError(venueData.message || "Venue not found.");
        return;
      }

      setVenue(venueData.data);
      await fetchAvailability();
    } catch (err) {
      setVenue(null);
      setSlots([]);
      setError(
        err.response?.data?.message ||
          "Unable to load venue details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoredContextRef.current = false;
    fetchVenueDetails();
  }, [venueId]);

  useEffect(() => {
    if (loading || restoredContextRef.current || slots.length === 0) return;

    const context = loadBookingContext(venueId);
    if (!context?.slotId) return;

    restoredContextRef.current = true;
    const slot = findSlotById(slots, context.slotId);

    if (slot && isSlotStillBookable(slots, slot)) {
      setSelectedSlot(slot);
      clearBookingContext();
    } else {
      clearBookingContext();
      setSlotUnavailableMessage(
        "Your previously selected slot is no longer available. Please choose another."
      );
    }
  }, [loading, slots, venueId]);

  useEffect(() => {
    if (!selectedSlot || bookingConfirmation) return;

    if (!isSlotStillBookable(slots, selectedSlot)) {
      setSelectedSlot(null);
      clearBookingContext();
      setSlotUnavailableMessage(
        "Your selected slot is no longer available. Please choose another slot."
      );
    }
  }, [slots, selectedSlot, bookingConfirmation]);

  const venueImages = useMemo(() => getVenueImages(venue), [venue]);

  const bookableSlots = useMemo(
    () => filterCustomerBookableSlots(slots),
    [slots]
  );

  const groupedSlots = useMemo(
    () => groupSlotsByDate(bookableSlots),
    [bookableSlots]
  );

  const availabilityEmptyState = useMemo(
    () => getCustomerAvailabilityEmptyState(slots),
    [slots]
  );

  const bookingPayload = useMemo(
    () => buildBookingPayload(venue, selectedSlot),
    [venue, selectedSlot]
  );

  const payloadValidation = useMemo(
    () => validateBookingPayload(bookingPayload),
    [bookingPayload]
  );

  const canBook =
    payloadValidation.valid && isRazorpayConfigured() && !isPaying && !bookingConfirmation;

  const handleSelectSlot = (slot) => {
    setSelectedSlot((prev) => {
      const next = prev?._id === slot._id ? null : slot;
      if (next && venueId) {
        saveBookingContext(venueId, next._id);
      } else {
        clearBookingContext();
      }
      return next;
    });
    setPaymentError("");
    setSlotUnavailableMessage("");
  };

  const handleBookNow = async () => {
    if (isPaying || bookingConfirmation) return;

    const validation = validateBookingPayload(bookingPayload);

    if (!validation.valid) {
      setPaymentError(validation.error);
      return;
    }

    if (!isRazorpayConfigured()) {
      setPaymentError(
        "Payment is temporarily unavailable. Razorpay is not configured (VITE_RAZORPAY_KEY_ID)."
      );
      return;
    }

    if (!isAuthenticated) {
      if (selectedSlot?._id) {
        saveBookingContext(venueId, selectedSlot._id);
      }
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    setIsPaying(true);
    setPaymentError("");

    const slotSnapshot = selectedSlot;

    try {
      const orderResponse = await createOrder(bookingPayload);

      if (!orderResponse?.success || !orderResponse?.order) {
        throw new Error(orderResponse?.message || "Failed to create order.");
      }

      const paymentResult = await openCheckout(orderResponse.order, {
        name: "BookMyVenue",
        description: venue?.title || "Venue booking",
      });

      const verifyResponse = await verifyPayment(bookingPayload, paymentResult);

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || "Payment verification failed.");
      }

      setBookingConfirmation(verifyResponse.data ?? null);
      setConfirmedSlotSnapshot(slotSnapshot);
      setSelectedSlot(null);
      clearBookingContext();
      await fetchVenueDetails({ preserveSelection: true });
    } catch (err) {
      setPaymentError(
        err.response?.data?.message ||
          err.message ||
          "Payment failed. Please try again."
      );
    } finally {
      setIsPaying(false);
    }
  };

  const handleDismissBookingSuccess = () => {
    setBookingConfirmation(null);
    setConfirmedSlotSnapshot(null);
    setPaymentError("");
    setSlotUnavailableMessage("");
  };

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
      return;
    }

    navigate("/venues");
  };

  const scrollToAvailability = () => {
    document.getElementById("availability")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const renderAlerts = () => (
    <div className="space-y-3">
      {!isRazorpayConfigured() && (
        <AlertBox variant="error" title="Payment unavailable">
          Razorpay is not configured (VITE_RAZORPAY_KEY_ID).
        </AlertBox>
      )}

      {slotUnavailableMessage && (
        <AlertBox variant="error" title="Slot unavailable">
          {slotUnavailableMessage}
        </AlertBox>
      )}

      {selectedSlot && !payloadValidation.valid && (
        <AlertBox variant="error" title="Cannot proceed with booking">
          {payloadValidation.error}
        </AlertBox>
      )}

      {paymentError && (
        <AlertBox variant="error" title="Payment failed">
          {paymentError}
        </AlertBox>
      )}

      {bookingConfirmation && (
        <BookingSuccessCard
          booking={bookingConfirmation}
          venue={venue}
          venueTitle={venue?.title}
          selectedSlot={confirmedSlotSnapshot}
          onViewBookings={() => navigate("/my-bookings")}
          onBookAnother={handleDismissBookingSuccess}
        />
      )}
    </div>
  );

  const bookingCardProps = {
    venue,
    selectedSlot,
    bookableSlotCount: bookableSlots.length,
    isAuthenticated,
    loginPath: location.pathname,
    canBook,
    isPaying,
    onBookNow: handleBookNow,
    onViewAvailability: scrollToAvailability,
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fafafa]">
      <main className="mx-auto w-full max-w-[1280px] px-4 pb-24 pt-6 sm:px-6 sm:pb-24 sm:pt-8 lg:px-8 lg:pb-10">
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-red-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>

        {loading && (
          <div className="py-8">
            <h1 className="text-2xl font-bold text-gray-900">Venue Details</h1>
            <p className="mt-2 text-sm text-gray-500">Loading venue...</p>
            <div className="mt-6">
              <Loader label="Loading venue details..." />
            </div>
          </div>
        )}

        {!loading && (error || !venue) && (
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Venue Details</h1>
            <div className="mt-6">
              <ErrorState
                message={error || "Venue not found."}
                onRetry={() => fetchVenueDetails()}
              />
            </div>
          </div>
        )}

        {!loading && !error && venue && (
          <>
            <VenueImageGallery images={venueImages} title={venue.title} />
            <VenueQuickFacts venue={venue} />

            <div className="mt-5 lg:mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-7 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
              <div className="min-w-0 space-y-4">
                <section className="rounded-2xl border border-gray-200/80 bg-white p-4 ring-1 ring-gray-100/80">
                  <h2 className="text-base font-semibold text-gray-900">
                    About this venue
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                    {venue.description ||
                      "No description provided for this venue yet."}
                  </p>
                </section>

                <VenueLocation venue={venue} />

                <VenueAmenities amenities={venue.amenities} />

                <section
                  id="availability"
                  className="scroll-mt-24 rounded-2xl border border-gray-200/80 bg-white p-3 ring-1 ring-gray-100/80 sm:p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-600">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
                        Availability
                      </h2>
                      <p className="text-xs text-gray-500 sm:text-sm">
                        One slot per booking — tap to select
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">{renderAlerts()}</div>

                  {slotsError && (
                    <div className="mt-3">
                      <ErrorState
                        message={slotsError}
                        onRetry={fetchAvailability}
                      />
                    </div>
                  )}

                  {!slotsError && availabilityEmptyState && (
                    <div className="mt-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-8 text-center">
                      <p className="text-sm font-semibold text-gray-900">
                        {availabilityEmptyState.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {availabilityEmptyState.description}
                      </p>
                      <Link
                        to="/venues"
                        className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        Browse other venues
                      </Link>
                    </div>
                  )}

                  {!slotsError && !availabilityEmptyState && (
                    <div className="mt-2.5 space-y-2.5">
                      {groupedSlots.map((group) => (
                        <div key={toDateKey(group.date)}>
                          <h3
                            className="mb-1.5 text-xs font-semibold text-gray-700 sm:text-sm"
                            title={formatSlotDate(group.date)}
                          >
                            {formatSlotDateCompact(group.date)}
                          </h3>
                          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-4">
                            {group.slots.map((slot) => (
                              <VenueSlotCard
                                key={slot._id}
                                slot={slot}
                                selected={selectedSlot?._id === slot._id}
                                onSelect={handleSelectSlot}
                                disabled={isPaying || Boolean(bookingConfirmation)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <VenueRules rules={venue.rules} />
                <VenueHostedBy venue={venue} />
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <VenueBookingCard {...bookingCardProps} />
                </div>
              </aside>
            </div>

            <MobileBookingBar
              venue={venue}
              selectedSlot={selectedSlot}
              canBook={canBook}
              isPaying={isPaying}
              onBookNow={handleBookNow}
              onSelectSlot={scrollToAvailability}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default VenueDetails;
