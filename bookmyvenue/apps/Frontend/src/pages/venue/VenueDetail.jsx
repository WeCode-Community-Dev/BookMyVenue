import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getVenueById } from "../../api/venues";
import { getAvailability } from "../../api/availability";
import { createBooking } from "../../api/bookings";

import { useAuth } from "../../context/AuthContext";

import Loading from "../../components/common/Loading";

import VenueGallery from "./VenueGallery";
import VenueOverview from "./VenueOverview";
import VenuePricing from "./VenuePricing";
import VenueAmenities from "./VenueAmenities";
import BookingPanel from "./BookingPanel";
import LoginBookingModal from "./LoginBookingModal";
import RegisterBookingModal from "./RegisterBookingModal";

import { calculateBookingSummary } from "./utils";

function VenueDetail() {
  const navigate = useNavigate();
  const { venueId } = useParams();

  const { token } = useAuth();

  const [venue, setVenue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentImageIndex, setCurrentImageIndex] =
    useState(0);

    const [selectedDate, setSelectedDate] =
    useState("");

  const [availabilityGroups, setAvailabilityGroups] =
    useState([]);

  const [selectedBookingType, setSelectedBookingType] =
    useState("");

  const [selectedSlotIds, setSelectedSlotIds] =
    useState([]);

  const [bookingSummary, setBookingSummary] =
    useState(null);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [bookingSuccess, setBookingSuccess] =
    useState(false);

  const [bookingError, setBookingError] =
    useState("");

  const [showLoginModal, setShowLoginModal] =
    useState(false);

  const [showRegisterModal, setShowRegisterModal] =
    useState(false);

  const [pendingBooking, setPendingBooking] =
    useState(false);

  /**
   * Load Venue
   */

  useEffect(() => {
    async function loadVenue() {
      try {
        setLoading(true);
        setError("");

        const data = await getVenueById(venueId);

        if (!data) {
          setError("Venue not found.");
          return;
        }

        setVenue(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load venue.");
      } finally {
        setLoading(false);
      }
    }

    if (venueId) {
      loadVenue();
    }
  }, [venueId]);

  /**
   * Load availability
   */

    async function handleDateChange(e) {
    const date = e.target.value;

    setSelectedDate(date);
    setAvailabilityGroups([]);
    setSelectedBookingType("");
    setSelectedSlotIds([]);
    setBookingSummary(null);
    setBookingError("");

    if (!date) return;

    try {
      setBookingLoading(true);

      const response =
        await getAvailability(
          venueId,
          date
        );

      setAvailabilityGroups(response || []);

      if (response && response.length === 1) {
        setSelectedBookingType(response[0].booking_type);
      }
    } catch (err) {
      console.error(err);

      setBookingError(
        "Unable to load availability."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  function handleBookingTypeChange(type) {
    setSelectedBookingType(type);
    setSelectedSlotIds([]);
    setBookingSummary(null);
  }

  /**
   * Slot selection
   */

    function toggleSlot(slot) {
    if (slot.is_booked) return;

    if (
      selectedBookingType ===
      "daily"
    ) {
      setSelectedSlotIds((prev) =>
        prev.includes(slot.id)
          ? []
          : [slot.id]
      );

      return;
    }

    setSelectedSlotIds((prev) =>
      prev.includes(slot.id)
        ? prev.filter(
            (id) => id !== slot.id
          )
        : [...prev, slot.id]
    );
  }

  /**
   * Booking Summary
   */

    useEffect(() => {
    const currentGroup = availabilityGroups.find(
      (g) => g.booking_type === selectedBookingType
    );

    setBookingSummary(
      calculateBookingSummary(
        venue,
        currentGroup,
        selectedSlotIds,
        selectedBookingType
      )
    );
  }, [
    venue,
    availabilityGroups,
    selectedBookingType,
    selectedSlotIds,
  ]);

  /**
   * Booking
   */

  async function submitBooking(
    authToken = token
  ) {
    if (!authToken) {
      setPendingBooking(true);
      setShowLoginModal(true);
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");

      await createBooking(
        {
          venue_id: venue.id,
          availability_ids:
            selectedSlotIds,
        },
        authToken
      );

      setBookingSuccess(true);

      setSelectedSlotIds([]);
      setBookingSummary(null);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);

      setBookingError(
        err.response?.data?.detail ||
          "Booking failed."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  function handleBookNow() {
    if (selectedSlotIds.length === 0)
      return;

    if (!token) {
      setPendingBooking(true);
      setShowLoginModal(true);
      return;
    }

    submitBooking();
  }

  /**
   * Loading
   */

  if (loading) {
    return (
      <Loading message="Loading venue..." />
    );
  }

  /**
   * Error
   */

  if (error || !venue) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">
          Venue not found
        </h1>

        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white"
        >
          Back to Home
        </button>
      </div>
    );
  }
    return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">

          {/* Back Button */}

          <button
            onClick={() => navigate("/")}
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>

          {/* Gallery */}

          <VenueGallery
            venue={venue}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
          />

          {/* Content */}

          <div className="mt-8 grid gap-8 lg:grid-cols-3">

            {/* Left */}

            <div className="space-y-8 lg:col-span-2">

              <VenueOverview
                venue={venue}
              />

              <VenuePricing
                venue={venue}
              />

              <VenueAmenities
                venue={venue}
              />

            </div>

            {/* Right */}

                        <BookingPanel
              venue={venue}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              availabilityGroups={availabilityGroups}
              selectedBookingType={selectedBookingType}
              onBookingTypeChange={handleBookingTypeChange}
              bookingLoading={bookingLoading}
              bookingSummary={bookingSummary}
              bookingError={bookingError}
              bookingSuccess={bookingSuccess}
              selectedSlotIds={selectedSlotIds}
              toggleSlot={toggleSlot}
              handleBookNow={handleBookNow}
            />

          </div>
        </div>
      </div>

      {/* Login */}

      <LoginBookingModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingBooking(false);
        }}
        onSuccess={(accessToken) => {
          setShowLoginModal(false);

          if (pendingBooking) {
            setPendingBooking(false);
            submitBooking(accessToken);
          }
        }}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      {/* Register */}

      <RegisterBookingModal
        isOpen={showRegisterModal}
        onClose={() => {
          setShowRegisterModal(false);
        }}
        onSuccess={(accessToken) => {
          setShowRegisterModal(false);

          if (pendingBooking) {
            setPendingBooking(false);
            submitBooking(accessToken);
          }
        }}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
}

export default VenueDetail;