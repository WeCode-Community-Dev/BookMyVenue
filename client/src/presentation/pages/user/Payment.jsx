import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import { ROUTES } from "@/constants/routes";

import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";

import { formatDateToDDMMYYYY } from "@/lib/utils";

import {
  reserveBooking,
} from "@/redux/slices/UserBookingSlice";

export default function Payment() {
  const { state } = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    loading,
    error,
  } = useSelector(
    (state) => state.userBooking
  );

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("online");

  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false);

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
    bookingType,
    bookingDate,
    startTime,
    endTime,
    guestCount,
  } = state;

  // ======================================
  // RESERVE BOOKING
  // ======================================

  const handleProceedToPayment = async () => {
    try {
      setIsProcessing(true);

      const bookingData = {
        venueId:
          venue._id || venue.id,

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

        guestCount,
      };

      const result = await dispatch(
        reserveBooking(bookingData)
      ).unwrap();

      /*
      Backend should return something like:

      {
        reservationId,
        venueId,
        bookingDate,
        totalAmount,
        advanceAmount,
        remainingAmount,
        expiresAt
      }
      */

      const reservationId =
        result.reservationId ||
        result.reservation?._id ||
        result.reservation?.reservationId;

      navigate(
        ROUTES.USER.PAYMENT_GATEWAY,
        {
          state: {
            venue,

            selectedPackage,

            bookingType,

            bookingDate,

            startTime:
              bookingType === "hourly"
                ? startTime
                : null,

            endTime:
              bookingType === "hourly"
                ? endTime
                : null,

            guestCount,

            paymentMethod,

            reservationId,

            totalAmount:
              result.totalAmount,

            advanceAmount:
              result.advanceAmount,

            remainingAmount:
              result.remainingAmount,

            expiresAt:
              result.expiresAt,
          },
        }
      );

    } catch (error) {
      console.error(
        "Reservation failed:",
        error
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-10">

        <div className="max-w-5xl mx-auto px-6">

          <h1 className="text-3xl font-bold">
            Payment
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

            {/* ============================== */}
            {/* PAYMENT SECTION */}
            {/* ============================== */}

            <div className="lg:col-span-2 bg-white rounded-2xl p-6">

              <h2 className="text-xl font-bold">
                Choose Payment Method
              </h2>

              {/* UPI / ONLINE */}

              <div
                className={`border rounded-xl p-4 mt-6 ${
                  paymentMethod === "online"
                    ? "border-black"
                    : ""
                }`}
              >

                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={
                      paymentMethod === "online"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  />

                  <span className="font-medium">
                    UPI / Online Payment
                  </span>

                </label>

              </div>

              {/* CARD */}

              <div
                className={`border rounded-xl p-4 mt-4 ${
                  paymentMethod === "card"
                    ? "border-black"
                    : ""
                }`}
              >

                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={
                      paymentMethod === "card"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  />

                  <span className="font-medium">
                    Credit / Debit Card
                  </span>

                </label>

              </div>

              {/* ERROR */}

              {error && (
                <p className="text-red-500 text-sm mt-5">
                  {error}
                </p>
              )}

              {/* CONTINUE */}

              <button
                type="button"
                onClick={
                  handleProceedToPayment
                }
                disabled={
                  loading ||
                  isProcessing
                }
                className="w-full mt-8 bg-black text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {loading ||
                isProcessing
                  ? "Preparing Payment..."
                  : "Proceed to Payment"}

              </button>

            </div>

            {/* ============================== */}
            {/* BOOKING SUMMARY */}
            {/* ============================== */}

            <div className="bg-white rounded-2xl p-6 h-fit">

              <h2 className="text-xl font-bold">
                Booking Summary
              </h2>

              {/* VENUE */}

              <p className="font-semibold mt-5">
                {venue.name}
              </p>

              {/* DATE */}

              <p className="text-gray-500 text-sm mt-2">

                {formatDateToDDMMYYYY(
                  bookingDate
                )}

              </p>

              {/* BOOKING TYPE */}

              <p className="text-gray-500 text-sm mt-2">

                Booking Type:{" "}

                <span className="font-medium text-gray-700">

                  {bookingType === "daily"
                    ? "Full Day"
                    : "Hour Wise"}

                </span>

              </p>

              {/* TIME */}

              {bookingType === "daily" ? (

                <p className="text-gray-500 text-sm mt-1">
                  Full day venue booking
                </p>

              ) : (

                <p className="text-gray-500 text-sm mt-1">
                  {startTime} - {endTime}
                </p>

              )}

              {/* GUESTS */}

              <p className="text-gray-500 text-sm mt-2">
                {guestCount} guests
              </p>

              {/* PRICE MESSAGE */}

              <div className="border-t mt-5 pt-5">

                <p className="text-sm text-gray-500">
                  The final amount will be calculated
                  by the server after checking the
                  venue pricing and charges.
                </p>

              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}