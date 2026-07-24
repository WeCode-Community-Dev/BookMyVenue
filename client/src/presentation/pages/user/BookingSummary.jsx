import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";

import { formatDateToDDMMYYYY } from "@/lib/utils";

export default function BookingSummary() {
  const { state } = useLocation();

  const navigate = useNavigate();

  // ======================================
  // NO BOOKING DATA
  // ======================================

  if (!state) {
    return (
      <>
        <Header />

        <main className="min-h-screen flex items-center justify-center">

          <p>
            Booking details not found.
          </p>

        </main>

        <Footer />
      </>
    );
  }

  const {
    venue,
    selectedPackage,
    bookingDate,
    bookingType,
    startTime,
    endTime,
    guestCount,
  } = state;

  // ======================================
  // BOOKING DATA FOR BACKEND
  // ======================================

  const bookingData = {
    venueId: venue._id || venue.id,

    bookingDate,

    bookingType,

    startTime:
      bookingType === "hourly"
        ? startTime
        : null,

    endTime:
      bookingType === "hourly"
        ? endTime
        : null,

    guestCount: Number(guestCount),
  };

  // ======================================
  // PROCEED TO PAYMENT
  // ======================================

  const handleProceedToPayment = () => {
    navigate(
      ROUTES.USER.PAYMENT,
      {
        state: {
          venue,
          guestCount,

          bookingData,
        },
      }
    );
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

            {/* ======================================
                BOOKING DETAILS
            ====================================== */}

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
                      bookingData.bookingDate
                    )}
                  </p>

                </div>

                {/* GUESTS */}

                <div>

                  <p className="text-gray-500 text-sm">
                    Guests
                  </p>

                  <p className="font-semibold">
                    {bookingData.guestCount}
                  </p>

                </div>

                {/* BOOKING TYPE */}

                <div>

                  <p className="text-gray-500 text-sm">
                    Booking Type
                  </p>

                  <p className="font-semibold">

                    {bookingData.bookingType === "daily"
                      ? "Full Day"
                      : "Hour Wise"}

                  </p>

                </div>

                {/* START TIME */}

                {bookingData.bookingType === "hourly" && (

                  <div>

                    <p className="text-gray-500 text-sm">
                      Start Time
                    </p>

                    <p className="font-semibold">
                      {bookingData.startTime}
                    </p>

                  </div>

                )}

                {/* END TIME */}

                {bookingData.bookingType === "hourly" && (

                  <div>

                    <p className="text-gray-500 text-sm">
                      End Time
                    </p>

                    <p className="font-semibold">
                      {bookingData.endTime}
                    </p>

                  </div>

                )}

              </div>

            </div>

            {/* ======================================
                PRICE SUMMARY
            ====================================== */}

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

                    {bookingData.bookingType === "daily"
                      ? "Full Day"
                      : "Hourly"}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span>
                    Guest Count
                  </span>

                  <span className="font-medium">
                    {bookingData.guestCount}
                  </span>

                </div>

              </div>

              <div className="border-t mt-5 pt-5">

                <p className="text-sm text-gray-500">
                  Final price, weekend surcharge,
                  security deposit, and advance payment
                  will be calculated by the server.
                </p>

              </div>

              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold"
              >
                Proceed to Payment
              </button>

            </div>

          </div>

        </div>

      </main>

      <Footer />

    </>
  );
}

