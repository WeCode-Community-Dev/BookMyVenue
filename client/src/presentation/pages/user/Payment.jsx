import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ROUTES } from "@/constants/routes";
import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";
import { formatDateToDDMMYYYY } from "@/lib/utils";

import { confirmBooking } from "@/redux/slices/UserBookingSlice";

import toast from "react-hot-toast";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector(
    (state) => state.userBooking
  );

  const [paymentMethod, setPaymentMethod] =
    useState("online");

  // User can choose advance or full payment
  const [paymentOption, setPaymentOption] =
    useState("advance");

  const [isProcessing, setIsProcessing] =
    useState(false);

  // ==============================
  // HANDLE MISSING STATE
  // ==============================

  if (!state) {
    return (
      <>
        <Header />

        <main className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">
            Booking details not found.
          </p>
        </main>

        <Footer />
      </>
    );
  }

  // ==============================
  // GET DATA FROM BOOKING SUMMARY
  // ==============================

  const {
    venue,
    selectedPackage,

    bookingType,
    bookingDate,
    startTime,
    endTime,
    guestCount,

    // Important values from reservation
    reservationId,
    totalAmount,
    advanceAmount,
    remainingAmount,
    expiresAt,
  } = state;

  // ==============================
  // VENUE ID
  // ==============================

  const venueId =
    venue?._id || venue?.id;

  // ==============================
  // NORMALIZE DATE
  // ==============================

  const normalizedDate =
    new Date(bookingDate)
      .toISOString()
      .split("T")[0];

  // ==============================
  // SELECTED PAYMENT AMOUNT
  // ==============================

  const selectedPaymentAmount =
    paymentOption === "full"
      ? totalAmount
      : advanceAmount;

  // ==============================
  // HANDLE PAYMENT SUCCESS
  // ==============================

  const handlePaymentSuccess = async () => {
    if (!reservationId) {
      toast.error(
        "Reservation not found. Please go back and try again."
      );
      return;
    }

    if (!venueId) {
      toast.error("Venue ID missing.");
      return;
    }

    try {
      setIsProcessing(true);

      // ==================================
      // CONFIRM EXISTING RESERVATION
      // ==================================

      const confirmedBooking =
        await dispatch(
          confirmBooking({
            reservationId,
            venueId,
            bookingDate: normalizedDate,

            // Send payment choice if your backend
            // supports it
            paymentOption,

            paymentMethod,
          })
        ).unwrap();

      console.log(
        "Confirmed booking:",
        confirmedBooking
      );

      toast.success(
        "Booking confirmed successfully!"
      );

      // ==================================
      // NAVIGATE TO SUCCESS PAGE
      // ==================================

      navigate(
        ROUTES.USER.PAYMENT_SUCCESS,
        {
          state: {
            venue,
            selectedPackage,

            bookingType,
            bookingDate: normalizedDate,

            startTime,
            endTime,
            guestCount,

            reservationId,

            totalAmount,
            advanceAmount,
            remainingAmount,

            // Which amount user selected
            paymentOption,

            // Actual amount paid
            paidAmount:
              selectedPaymentAmount,

            paymentMethod,

            expiresAt,

            paymentStatus: "success",
          },
        }
      );
    } catch (error) {
      console.error(
        "Booking confirmation failed:",
        error
      );

      toast.error(
        error?.message ||
          "Booking confirmation failed."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ==============================
  // HANDLE PAYMENT FAILURE
  // ==============================

  const handlePaymentFailure = () => {
    navigate(
      ROUTES.USER.PAYMENT_FAILURE,
      {
        state: {
          venue,
          selectedPackage,

          bookingType,

          bookingDate: normalizedDate,

          startTime,
          endTime,

          guestCount,

          paymentMethod,

          paymentOption,

          totalAmount,
          advanceAmount,
          remainingAmount,

          reservationId,

          paymentStatus: "failure",
        },
      }
    );
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-10">

        <div className="max-w-5xl mx-auto px-6">

          {/* PAGE TITLE */}

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

              {/* ============================== */}
              {/* PAYMENT METHOD */}
              {/* ============================== */}

              {/* ONLINE PAYMENT */}

              <div
                className={`border rounded-xl p-4 mt-6 ${
                  paymentMethod === "online"
                    ? "border-black"
                    : "border-gray-200"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="radio"
                    name="paymentMethod"
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

              {/* CARD PAYMENT */}

              <div
                className={`border rounded-xl p-4 mt-4 ${
                  paymentMethod === "card"
                    ? "border-black"
                    : "border-gray-200"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="radio"
                    name="paymentMethod"
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

              {/* ============================== */}
              {/* PAYMENT AMOUNT */}
              {/* ============================== */}

              <h2 className="text-xl font-bold mt-8">
                Choose Amount to Pay
              </h2>

              {/* ADVANCE PAYMENT */}

              <div
                className={`border rounded-xl p-4 mt-5 cursor-pointer ${
                  paymentOption === "advance"
                    ? "border-black"
                    : "border-gray-200"
                }`}
                onClick={() =>
                  setPaymentOption("advance")
                }
              >
                <label className="flex items-center justify-between cursor-pointer">

                  <div className="flex items-center gap-3">

                    <input
                      type="radio"
                      name="paymentOption"
                      value="advance"
                      checked={
                        paymentOption ===
                        "advance"
                      }
                      onChange={() =>
                        setPaymentOption(
                          "advance"
                        )
                      }
                    />

                    <span className="font-medium">
                      Pay Advance Amount
                    </span>

                  </div>

                  <span className="font-bold">
                    ₹{advanceAmount}
                  </span>

                </label>

                <p className="text-sm text-gray-500 mt-2 ml-6">
                  Remaining balance: ₹
                  {remainingAmount}
                </p>

              </div>

              {/* FULL PAYMENT */}

              <div
                className={`border rounded-xl p-4 mt-4 cursor-pointer ${
                  paymentOption === "full"
                    ? "border-black"
                    : "border-gray-200"
                }`}
                onClick={() =>
                  setPaymentOption("full")
                }
              >
                <label className="flex items-center justify-between cursor-pointer">

                  <div className="flex items-center gap-3">

                    <input
                      type="radio"
                      name="paymentOption"
                      value="full"
                      checked={
                        paymentOption === "full"
                      }
                      onChange={() =>
                        setPaymentOption("full")
                      }
                    />

                    <span className="font-medium">
                      Pay Full Amount
                    </span>

                  </div>

                  <span className="font-bold">
                    ₹{totalAmount}
                  </span>

                </label>

                <p className="text-sm text-gray-500 mt-2 ml-6">
                  No remaining balance
                </p>

              </div>

              {/* ============================== */}
              {/* ERROR */}
              {/* ============================== */}

              {error && (
                <p className="text-red-500 text-sm mt-5">
                  {error}
                </p>
              )}

              {/* ============================== */}
              {/* ACTION BUTTONS */}
              {/* ============================== */}

              <div className="flex gap-4 mt-8">

                {/* PAYMENT SUCCESS */}

                <button
                  type="button"
                  onClick={
                    handlePaymentSuccess
                  }
                  disabled={
                    loading ||
                    isProcessing
                  }
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ||
                  isProcessing
                    ? "Processing..."
                    : `Pay ₹${selectedPaymentAmount}`}
                </button>

                {/* PAYMENT FAILURE */}

                <button
                  type="button"
                  onClick={
                    handlePaymentFailure
                  }
                  disabled={
                    loading ||
                    isProcessing
                  }
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Payment Failure
                </button>

              </div>

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
                {venue?.name}
              </p>

              {/* DATE */}

              <p className="text-gray-500 text-sm mt-2">
                {formatDateToDDMMYYYY(
                  normalizedDate
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

              {/* GUEST COUNT */}

              <p className="text-gray-500 text-sm mt-2">
                {guestCount} guests
              </p>

              {/* ============================== */}
              {/* PRICE SUMMARY */}
              {/* ============================== */}

              <div className="border-t mt-5 pt-5 space-y-3">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Total Amount
                  </span>

                  <span className="font-semibold">
                    ₹{totalAmount}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Advance Amount
                  </span>

                  <span className="font-semibold">
                    ₹{advanceAmount}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Remaining Balance
                  </span>

                  <span className="font-semibold">
                    ₹{remainingAmount}
                  </span>

                </div>

              </div>

              {/* SELECTED PAYMENT */}

              <div className="border-t mt-5 pt-5">

                <div className="flex justify-between">

                  <span className="font-semibold">
                    Pay Now
                  </span>

                  <span className="font-bold">
                    ₹{selectedPaymentAmount}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}