import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ROUTES } from "@/constants/routes";
import { reserveBooking } from "@/redux/slices/UserBookingSlice";

import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";

import { formatDateToDDMMYYYY } from "@/lib/utils";

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

        <main className="min-h-screen flex items-center justify-center">
          <p>Booking details not found.</p>
        </main>

        <Footer />
      </>
    );
  }

  const {
    venue,
    bookingDate,
    bookingType,
    startTime,
    endTime,
    guestCount,
  } = state;

  // ======================================
  // VENUE ID
  // ======================================

  const venueId = venue?._id || venue?.id;

  // ======================================
  // NORMALIZED DATE
  // ======================================

  const normalizedDate = new Date(bookingDate)
    .toISOString()
    .split("T")[0];

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
    if (
      !venueId ||
      !normalizedDate ||
      !bookingType ||
      !guestCount
    ) {
      alert(
        "Missing booking details. Please go back and fill all fields."
      );
      return;
    }

    try {
      const reservation = await dispatch(
        reserveBooking(bookingData)
      ).unwrap();

      console.log(
        "Reservation created:",
        reservation
      );

      navigate(
        ROUTES.USER.PAYMENT,
        {
          state: {
            venue,

            bookingDate: normalizedDate,

            bookingType,

            startTime: finalStartTime,

            endTime: finalEndTime,

            guestCount: Number(guestCount),

            // Reservation ID
            reservationId:
              reservation.reservationId,

            // Actual server-calculated amounts
            totalAmount:
              reservation.totalAmount,

            advanceAmount:
              reservation.advanceAmount,

            remainingAmount:
              reservation.remainingAmount,

            expiresAt:
              reservation.expiresAt,
          },
        }
      );
    } catch (error) {
      console.error(
        "Reservation failed:",
        error
      );
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-6">

          <h1 className="text-3xl font-bold">
            Booking Summary
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

            {/* ============================== */}
            {/* BOOKING DETAILS */}
            {/* ============================== */}

            <div className="lg:col-span-2 bg-white rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-6">
                Booking Details
              </h2>

              {/* VENUE */}

              <div className="flex gap-4">

                <img
                  src={venue.images?.[0]?.url}
                  alt={venue.name}
                  className="w-32 h-24 object-cover rounded-xl"
                />

                <div>

                  <h3 className="text-lg font-bold">
                    {venue.name}
                  </h3>

                  <p className="text-gray-500">
                    📍{" "}
                    {venue.address?.city},{" "}
                    {venue.address?.state}
                  </p>

                </div>

              </div>

              {/* BOOKING INFORMATION */}

              <div className="grid grid-cols-2 gap-6 mt-8">

                {/* DATE */}

                <div>
                  <p className="text-gray-500 text-sm">
                    Event Date
                  </p>

                  <p className="font-semibold">
                    {formatDateToDDMMYYYY(
                      normalizedDate
                    )}
                  </p>
                </div>

                {/* GUESTS */}

                <div>
                  <p className="text-gray-500 text-sm">
                    Guests
                  </p>

                  <p className="font-semibold">
                    {guestCount}
                  </p>
                </div>

                {/* BOOKING TYPE */}

                <div>
                  <p className="text-gray-500 text-sm">
                    Booking Type
                  </p>

                  <p className="font-semibold">
                    {bookingType === "daily"
                      ? "Full Day"
                      : "Hour Wise"}
                  </p>
                </div>

                {/* START TIME */}

                <div>
                  <p className="text-gray-500 text-sm">
                    Start Time
                  </p>

                  <p className="font-semibold">
                    {finalStartTime}
                  </p>
                </div>

                {/* END TIME */}

                <div>
                  <p className="text-gray-500 text-sm">
                    End Time
                  </p>

                  <p className="font-semibold">
                    {finalEndTime}
                  </p>
                </div>

              </div>

            </div>

            {/* ============================== */}
            {/* PRICE SUMMARY */}
            {/* ============================== */}

            <div className="bg-white rounded-2xl p-6 h-fit">

              <h2 className="text-xl font-bold">
                Price Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between">
                  <span>
                    Booking Type
                  </span>

                  <span className="font-medium">
                    {bookingType === "daily"
                      ? "Full Day"
                      : "Hourly"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Guest Count
                  </span>

                  <span className="font-medium">
                    {guestCount}
                  </span>
                </div>

              </div>

              {error && (
                <p className="mt-5 text-sm text-red-500">
                  {error}
                </p>
              )}

              <div className="border-t mt-5 pt-5">

                <p className="text-sm text-gray-500">
                  The final booking amount will be
                  calculated by the server after
                  checking the venue pricing and charges.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  handleProceedToPayment
                }
                disabled={loading}
                className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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