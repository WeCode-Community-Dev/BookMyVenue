import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/routes";
import { reserveBooking } from "@/redux/slices/UserBookingSlice";

import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";

// ======================================
// FORMAT TIME - 12 HOUR
// ======================================

const formatTime12Hour = (time) => {
  if (!time) return "--";

  const [hours, minutes] = time.split(":");
  const hour = Number(hours);

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minutes} ${period}`;
};

// ======================================
// FORMAT DATE
// ======================================

const formatBookingDate = (date) => {
  if (!date) return "--";

  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
};

export default function BookingSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector(
    (state) => state.userBooking
  );

  // ======================================
  // NO BOOKING DATA
  // ======================================

  if (!state) {
    return (
      <>
        <Header />

        <main className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-gray-50 px-6">
          <div className="text-center">
            <p className="text-gray-600">
              Booking details not found.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(ROUTES.USER.BROWSE_VENUES)
              }
              className="mt-4 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Back to Venues
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ======================================
  // BOOKING STATE
  // ======================================

  const {
    venue,
    venueId: stateVenueId,
    bookingDate,
    bookingType,
    startTime,
    endTime,
    guestCount,
  } = state;

  // ======================================
  // VENUE ID
  // ======================================

  const venueId =
    stateVenueId ||
    venue?._id?.toString?.() ||
    venue?.id?.toString?.();

  // ======================================
  // BACK TO VENUE DETAILS
  // ======================================

  const handleBackToVenue = () => {
    const currentVenueId =
      venueId ||
      venue?._id?.toString?.() ||
      venue?.id?.toString?.();

    if (!currentVenueId) {
      navigate(ROUTES.USER.BROWSE_VENUES);
      return;
    }

    navigate(
      ROUTES.USER.VENUE_DETAILS.replace(
        ":id",
        currentVenueId
      )
    );
  };

  // ======================================
  // NORMALIZED DATE
  // ======================================

  const normalizedDate = bookingDate
    ? bookingDate.split("T")[0]
    : "";

  // ======================================
  // DAILY BOOKING TIME
  // ======================================

  const finalStartTime =
    bookingType === "daily"
      ? "00:00"
      : startTime;

  const finalEndTime =
    bookingType === "daily"
      ? "23:59"
      : endTime;

  // ======================================
  // BOOKING DATA
  // ======================================

  const bookingData = {
    venueId,
    bookingDate: normalizedDate,
    bookingType,
    startTime: finalStartTime,
    endTime: finalEndTime,
    guestCount: Number(guestCount),
  };

  // ======================================
  // PROCEED TO PAYMENT
  // ======================================

  const handleProceedToPayment = async () => {
    // --------------------------------------
    // BASIC VALIDATION
    // --------------------------------------

    if (
      !venueId ||
      !normalizedDate ||
      !bookingType ||
      !guestCount
    ) {
      toast.error(
        "Missing booking details. Please go back and fill all fields."
      );

      return;
    }

    // --------------------------------------
    // HOURLY BOOKING VALIDATION
    // --------------------------------------

    if (
      bookingType === "hourly" &&
      (!finalStartTime || !finalEndTime)
    ) {
      toast.error(
        "Please select an available time slot."
      );

      return;
    }

    try {
      // --------------------------------------
      // RESERVE BOOKING
      // --------------------------------------

      const reservation = await dispatch(
        reserveBooking(bookingData)
      ).unwrap();

      console.log(
        "Reservation created:",
        reservation
      );

      // --------------------------------------
      // SUCCESS
      // --------------------------------------

      navigate(ROUTES.USER.PAYMENT, {
        state: {
          venue,

          bookingDate:
            normalizedDate,

          bookingType,

          startTime:
            finalStartTime,

          endTime:
            finalEndTime,

          guestCount:
            Number(guestCount),

          reservationId:
            reservation.reservationId,

          totalAmount:
            reservation.totalAmount,

          advanceAmount:
            reservation.advanceAmount,

          remainingAmount:
            reservation.remainingAmount,

          expiresAt:
            reservation.expiresAt,
        },
      });
    } catch (error) {
      // --------------------------------------
      // RESERVATION FAILED
      // --------------------------------------

      console.error(
        "Reservation failed:",
        error
      );

      toast.error(
        error?.message ||
          error ||
          "This slot is no longer available. Please select another slot."
      );
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-[calc(100vh-140px)] bg-gray-50">
        <div className="w-full px-6 py-8 lg:px-10 xl:px-16">

          {/* ======================================
              BACK BUTTON
          ====================================== */}

          <button
            type="button"
            onClick={handleBackToVenue}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
          >
            <span className="text-lg">
              ←
            </span>

            Back to Venue
          </button>

          {/* ======================================
              PAGE HEADER
          ====================================== */}

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Booking Summary
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Review your booking details before proceeding to payment.
            </p>
          </div>

          {/* ======================================
              MAIN CONTENT
          ====================================== */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* ==================================
                BOOKING DETAILS
            ================================== */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">

              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Booking Details
              </h2>

              {/* ==================================
                  VENUE
              ================================== */}

              <div className="flex gap-5">

                {/* VENUE IMAGE */}

                <button
                  type="button"
                  onClick={handleBackToVenue}
                  className="group shrink-0 overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  <img
                    src={venue?.images?.[0]?.url}
                    alt={
                      venue?.name ||
                      "Venue"
                    }
                    className="h-28 w-40 object-cover transition duration-300 group-hover:scale-105"
                  />
                </button>

                {/* VENUE INFORMATION */}

                <div className="min-w-0">

                  <button
                    type="button"
                    onClick={handleBackToVenue}
                    className="text-left"
                  >
                    <h3 className="text-xl font-bold text-gray-900 transition hover:text-gray-600">
                      {venue?.name}
                    </h3>
                  </button>

                  <p className="mt-2 text-sm text-gray-500">
                    📍{" "}
                    {venue?.address?.city}

                    {venue?.address?.city &&
                      venue?.address?.state
                      ? ", "
                      : ""}

                    {venue?.address?.state}
                  </p>

                </div>
              </div>

              {/* ==================================
                  BOOKING INFORMATION
              ================================== */}

              <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

                {/* BOX HEADER */}

                <div className="border-b border-gray-200 bg-white px-5 py-4">
                  <h3 className="font-semibold text-gray-900">
                    Booking Information
                  </h3>
                </div>

                {/* INFORMATION GRID */}

                <div className="grid grid-cols-1 sm:grid-cols-2">

                  {/* DATE */}

                  <div className="flex items-center gap-4 border-b border-gray-200 p-5 sm:border-r">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                      📅
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Event Date
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {formatBookingDate(
                          normalizedDate
                        )}
                      </p>
                    </div>
                  </div>

                  {/* GUESTS */}

                  <div className="flex items-center gap-4 border-b border-gray-200 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                      👥
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Guests
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {guestCount} Guests
                      </p>
                    </div>
                  </div>

                  {/* BOOKING TYPE */}

                  <div className="flex items-center gap-4 border-b border-gray-200 p-5 sm:border-r">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                      🏷️
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Booking Type
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {bookingType === "daily"
                          ? "Full Day"
                          : "Hourly"}
                      </p>
                    </div>
                  </div>

                  {/* TIME */}

                  <div className="flex items-center gap-4 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                      🕐
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Time
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {bookingType === "daily"
                          ? "Full Day"
                          : `${formatTime12Hour(
                              finalStartTime
                            )} - ${formatTime12Hour(
                              finalEndTime
                            )}`}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* ==================================
                PRICE SUMMARY
            ================================== */}

            <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-900">
                Price Summary
              </h2>

              <div className="mt-6 space-y-5">

                {/* BOOKING TYPE */}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Booking Type
                  </span>

                  <span className="font-medium text-gray-900">
                    {bookingType === "daily"
                      ? "Full Day"
                      : "Hourly"}
                  </span>
                </div>

                {/* DATE */}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Event Date
                  </span>

                  <span className="font-medium text-gray-900">
                    {formatBookingDate(
                      normalizedDate
                    )}
                  </span>
                </div>

                {/* GUEST COUNT */}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Guest Count
                  </span>

                  <span className="font-medium text-gray-900">
                    {guestCount}
                  </span>
                </div>

                {/* TIME */}

                {bookingType === "hourly" && (
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Time
                    </span>

                    <span className="text-right font-medium text-gray-900">
                      {formatTime12Hour(
                        finalStartTime
                      )}{" "}
                      -{" "}
                      {formatTime12Hour(
                        finalEndTime
                      )}
                    </span>
                  </div>
                )}

              </div>

              {/* ==================================
                  SERVER ERROR
              ================================== */}

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* ==================================
                  SERVER PRICE MESSAGE
              ================================== */}

              <div className="mt-6 border-t border-gray-200 pt-5">
                <p className="text-sm leading-5 text-gray-500">
                  The final booking amount will be
                  calculated by the server after checking
                  the venue pricing and applicable charges.
                </p>
              </div>

              {/* ==================================
                  RESERVATION EXPIRY REMINDER
              ================================== */}

              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-5 text-amber-800">
                  ⏱️{" "}
                  <span className="font-semibold">
                    Quick reminder:
                  </span>{" "}
                  Please complete your payment before your
                  reservation expires. If it expires, you’ll
                  need to start the booking again, and the
                  selected slot may be taken by someone else.
                </p>
              </div>

              {/* ==================================
                  PAYMENT BUTTON
              ================================== */}

              <button
                type="button"
                onClick={handleProceedToPayment}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Reserving..."
                  : "Proceed to Payment"}
              </button>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}