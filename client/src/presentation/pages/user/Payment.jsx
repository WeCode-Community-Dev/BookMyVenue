import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ROUTES } from "@/constants/routes";
import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";
import { formatDateToDDMMYYYY } from "@/lib/utils";

import {
  confirmBooking,
  payRemainingBooking,
} from "@/redux/slices/UserBookingSlice";

import toast from "react-hot-toast";

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
// FORMAT TIME RANGE
// ======================================

const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return "--";
  }

  return `${formatTime12Hour(startTime)} - ${formatTime12Hour(
    endTime
  )}`;
};

// ======================================
// NORMALIZE DATE
// ======================================

const normalizeDate = (date) => {
  if (!date) return "";

  if (typeof date === "string") {
    return date.split("T")[0];
  }

  return new Date(date).toISOString().split("T")[0];
};

// ======================================
// CHECK DATE WITHIN 3 DAYS
// ======================================

const isWithinThreeDays = (bookingDate) => {
  if (!bookingDate) return false;

  const today = new Date();

  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const [year, month, day] = bookingDate
    .split("-")
    .map(Number);

  const eventDate = new Date(
    year,
    month - 1,
    day
  );

  const difference =
    eventDate.getTime() -
    todayDate.getTime();

  const daysDifference =
    difference / (1000 * 60 * 60 * 24);

  return (
    daysDifference >= 0 &&
    daysDifference <= 3
  );
};

// ======================================
// PAYMENT PAGE
// ======================================

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector(
    (state) => state.userBooking
  );

  const [paymentMethod, setPaymentMethod] =
    useState("online");

  const [paymentOption, setPaymentOption] =
    useState("advance");

  const [isProcessing, setIsProcessing] =
    useState(false);

  // ======================================
  // NO STATE
  // ======================================

  if (!state) {
    return (
      <>
        <Header />

        <main className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600">
              Booking details not found.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  ROUTES.USER.BROWSE_VENUES
                )
              }
              className="mt-4 rounded-xl bg-black px-5 py-3 font-semibold text-white"
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
  // GET STATE DATA
  // ======================================

  const {
    venue,
    selectedPackage,

    bookingId,
    reservationId,

    bookingType,
    bookingDate,
    startTime,
    endTime,
    guestCount,

    totalAmount,
    advanceAmount,
    remainingAmount,

    expiresAt,

    paymentType,
    isRemainingPayment,
  } = state;

  // ======================================
  // DETERMINE PAYMENT FLOW
  // ======================================

  const isPayingRemainingBalance =
    isRemainingPayment === true ||
    paymentType === "remaining";

  // ======================================
  // VENUE ID
  // ======================================

  const venueId =
    venue?._id?.toString?.() ||
    venue?.id?.toString?.();

  // ======================================
  // NORMALIZED DATE
  // ======================================

  const normalizedDate =
    normalizeDate(bookingDate);

  // ======================================
  // DISPLAY DATE
  // ======================================

  const displayDate =
    normalizedDate
      ? formatDateToDDMMYYYY(normalizedDate)
      : "--";

  // ======================================
  // CHECK 3-DAY RULE
  // ======================================

  const withinThreeDays =
    isWithinThreeDays(normalizedDate);

  // ======================================
  // EFFECTIVE PAYMENT OPTION
  //
  // Remaining booking:
  //     remaining
  //
  // Fresh booking within 3 days:
  //     full
  //
  // Fresh booking:
  //     selected option
  // ======================================

  const effectivePaymentOption =
    isPayingRemainingBalance
      ? "remaining"
      : withinThreeDays
        ? "full"
        : paymentOption;

  // ======================================
  // SELECTED PAYMENT AMOUNT
  // ======================================

  const selectedPaymentAmount =
    effectivePaymentOption === "remaining"
      ? Number(remainingAmount || 0)
      : effectivePaymentOption === "full"
        ? Number(totalAmount || 0)
        : Number(advanceAmount || 0);

  // ======================================
  // PAYMENT LABEL
  // ======================================

  const paymentLabel =
    effectivePaymentOption === "remaining"
      ? "Pay Remaining Balance"
      : effectivePaymentOption === "full"
        ? "Pay Full Amount"
        : "Pay Advance Amount";

  // ======================================
  // BACK TO BOOKING SUMMARY
  // ======================================

  const handleBackToSummary = () => {
    navigate(
      ROUTES.USER.BOOKING_SUMMARY,
      {
        state,
      }
    );
  };

  // ======================================
  // HANDLE PAYMENT SUCCESS
  // ======================================

  const handlePaymentSuccess = async () => {
    // ====================================
    // REMAINING BALANCE PAYMENT
    // ====================================

    if (isPayingRemainingBalance) {
      if (!bookingId) {
        toast.error(
          "Booking ID is missing. Please go back and try again."
        );

        return;
      }

      if (selectedPaymentAmount <= 0) {
        toast.error(
          "Remaining payment amount is not available."
        );

        return;
      }

      try {
        setIsProcessing(true);

        const updatedBooking =
          await dispatch(
            payRemainingBooking({
              bookingId,
              paymentMethod,
            })
          ).unwrap();

        console.log(
          "Remaining payment completed:",
          updatedBooking
        );

        toast.success(
          "Remaining balance paid successfully!"
        );

        // ==================================
        // SUCCESS PAGE
        // ==================================

        navigate(
          ROUTES.USER.PAYMENT_SUCCESS,
          {
            state: {
              venue,
              selectedPackage,

              bookingId,

              bookingType,

              bookingDate:
                normalizedDate,

              startTime,
              endTime,
              guestCount,

              totalAmount,

              // Existing paid amount + remaining
              // would be the final paid amount.
              paidAmount:
                Number(totalAmount || 0),

              remainingAmount: 0,

              paymentOption:
                "remaining",

              paymentMethod,

              paymentStatus: "success",

              isRemainingPayment: true,

              expiresAt,

              booking:
                updatedBooking,
            },
          }
        );

        return;
      } catch (error) {
        console.error(
          "Remaining payment failed:",
          error
        );

        toast.error(
          error?.message ||
            error ||
            "Failed to pay remaining amount."
        );

        return;
      } finally {
        setIsProcessing(false);
      }
    }

    // ====================================
    // FRESH BOOKING
    // ====================================

    if (!reservationId) {
      toast.error(
        "Reservation not found or expired. Please go back and select the slot again."
      );

      return;
    }

    if (!venueId) {
      toast.error("Venue ID is missing.");

      return;
    }

    if (!normalizedDate) {
      toast.error("Booking date is missing.");

      return;
    }

    if (selectedPaymentAmount <= 0) {
      toast.error(
        "Payment amount is not available."
      );

      return;
    }

    try {
      setIsProcessing(true);

      // ==================================
      // CONFIRM NEW BOOKING
      // ==================================

      const confirmedBooking =
        await dispatch(
          confirmBooking({
            reservationId,

            venueId,

            bookingDate:
              normalizedDate,

            paymentOption:
              effectivePaymentOption,

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
      // SUCCESS PAGE
      // ==================================

      navigate(
        ROUTES.USER.PAYMENT_SUCCESS,
        {
          state: {
            venue,
            selectedPackage,

            bookingType,

            bookingDate:
              normalizedDate,

            startTime,
            endTime,

            guestCount,

            reservationId,

            totalAmount,
            advanceAmount,
            remainingAmount,

            paymentOption:
              effectivePaymentOption,

            paidAmount:
              selectedPaymentAmount,

            paymentMethod,

            bookingId:
              confirmedBooking.id,

            expiresAt,

            paymentStatus:
              "success",

            isRemainingPayment:
              false,
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
          error ||
          "Booking confirmation failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ======================================
  // HANDLE PAYMENT FAILURE
  // ======================================

  const handlePaymentFailure = () => {
    navigate(
      ROUTES.USER.PAYMENT_FAILURE,
      {
        state: {
          venue,
          selectedPackage,

          bookingId,

          bookingType,

          bookingDate:
            normalizedDate,

          startTime,
          endTime,

          guestCount,

          paymentMethod,

          paymentOption:
            effectivePaymentOption,

          totalAmount,
          advanceAmount,
          remainingAmount,

          reservationId,

          paymentStatus:
            "failure",

          isRemainingPayment:
            isPayingRemainingBalance,
        },
      }
    );
  };

  // ======================================
  // RENDER
  // ======================================

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-10">
        <div className="mx-auto max-w-5xl px-6">

          {/* ==================================
              BACK BUTTON
          ================================== */}

          <button
            type="button"
            onClick={handleBackToSummary}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
          >
            <span className="text-lg">
              ←
            </span>

            Back to Booking Summary
          </button>

          {/* ==================================
              PAGE TITLE
          ================================== */}

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Payment
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Review your booking and complete your payment.
            </p>
          </div>

          {/* ==================================
              MAIN GRID
          ================================== */}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* ==================================
                PAYMENT SECTION
            ================================== */}

            <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">

              {/* ==================================
                  REMAINING BALANCE
              ================================== */}

              {isPayingRemainingBalance ? (
                <>
                  <h2 className="text-xl font-bold text-gray-900">
                    Remaining Balance Payment
                  </h2>

                  <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
                    <p className="text-sm leading-6 text-blue-800">
                      Your booking has already been confirmed.
                      You only need to pay the remaining balance
                      for this booking.
                    </p>
                  </div>

                  {/* REMAINING AMOUNT */}

                  <div className="mt-6 rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between gap-4">

                      <div>
                        <p className="text-sm text-gray-500">
                          Remaining Balance
                        </p>

                        <p className="mt-1 text-2xl font-bold text-gray-900">
                          ₹
                          {Number(
                            remainingAmount || 0
                          ).toLocaleString()}
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Balance Due
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* ==================================
                      PAYMENT METHOD
                  ================================== */}

                  <h2 className="text-xl font-bold text-gray-900">
                    Choose Payment Method
                  </h2>

                  {/* ONLINE PAYMENT */}

                  <div
                    className={`mt-6 rounded-xl border p-4 ${
                      paymentMethod === "online"
                        ? "border-black"
                        : "border-gray-200"
                    }`}
                  >
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={
                          paymentMethod ===
                          "online"
                        }
                        onChange={(event) =>
                          setPaymentMethod(
                            event.target.value
                          )
                        }
                      />

                      <span className="font-medium text-gray-900">
                        UPI / Online Payment
                      </span>
                    </label>
                  </div>

                  {/* CARD */}

                  <div
                    className={`mt-4 rounded-xl border p-4 ${
                      paymentMethod === "card"
                        ? "border-black"
                        : "border-gray-200"
                    }`}
                  >
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={
                          paymentMethod ===
                          "card"
                        }
                        onChange={(event) =>
                          setPaymentMethod(
                            event.target.value
                          )
                        }
                      />

                      <span className="font-medium text-gray-900">
                        Credit / Debit Card
                      </span>
                    </label>
                  </div>

                  {/* ==================================
                      PAYMENT AMOUNT
                  ================================== */}

                  <h2 className="mt-8 text-xl font-bold text-gray-900">
                    Choose Amount to Pay
                  </h2>

                  {/* ==================================
                      WITHIN 3 DAYS MESSAGE
                  ================================== */}

                  {withinThreeDays && (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5">
                      <p className="text-sm font-semibold text-amber-900">
                        Full payment required
                      </p>

                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        Since your event date is within
                        the next 3 days, advance payment
                        is not available. Please complete
                        the full payment to confirm your
                        booking.
                      </p>
                    </div>
                  )}

                  {/* ==================================
                      ADVANCE PAYMENT
                  ================================== */}

                  {!withinThreeDays && (
                    <div
                      className={`mt-5 cursor-pointer rounded-xl border p-4 ${
                        paymentOption ===
                        "advance"
                          ? "border-black"
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        setPaymentOption(
                          "advance"
                        )
                      }
                    >
                      <label className="flex cursor-pointer items-center justify-between">
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

                          <span className="font-medium text-gray-900">
                            Pay Advance Amount
                          </span>
                        </div>

                        <span className="font-bold text-gray-900">
                          ₹
                          {Number(
                            advanceAmount || 0
                          ).toLocaleString()}
                        </span>
                      </label>

                      <p className="ml-6 mt-2 text-sm text-gray-500">
                        Remaining balance: ₹
                        {Number(
                          remainingAmount || 0
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* ==================================
                      FULL PAYMENT
                  ================================== */}

                  <div
                    className={`mt-4 cursor-pointer rounded-xl border p-4 ${
                      effectivePaymentOption ===
                      "full"
                        ? "border-black"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      setPaymentOption("full")
                    }
                  >
                    <label className="flex cursor-pointer items-center justify-between">

                      <div className="flex items-center gap-3">

                        <input
                          type="radio"
                          name="paymentOption"
                          value="full"
                          checked={
                            effectivePaymentOption ===
                            "full"
                          }
                          onChange={() =>
                            setPaymentOption(
                              "full"
                            )
                          }
                        />

                        <span className="font-medium text-gray-900">
                          Pay Full Amount
                        </span>
                      </div>

                      <span className="font-bold text-gray-900">
                        ₹
                        {Number(
                          totalAmount || 0
                        ).toLocaleString()}
                      </span>
                    </label>

                    <p className="ml-6 mt-2 text-sm text-gray-500">
                      No remaining balance
                    </p>
                  </div>
                </>
              )}

              {/* ==================================
                  ERROR
              ================================== */}

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm leading-6 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* ==================================
                  PAYMENT ACTION
              ================================== */}

              <div className="mt-8 flex gap-4">

                {/* PAY BUTTON */}

                <button
                  type="button"
                  onClick={
                    handlePaymentSuccess
                  }
                  disabled={
                    loading ||
                    isProcessing ||
                    selectedPaymentAmount <= 0
                  }
                  className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ||
                  isProcessing
                    ? "Processing..."
                    : `${paymentLabel} ₹${selectedPaymentAmount.toLocaleString()}`}
                </button>

                {/* FAILURE */}

                <button
                  type="button"
                  onClick={
                    handlePaymentFailure
                  }
                  disabled={
                    loading ||
                    isProcessing
                  }
                  className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Payment Failure
                </button>

              </div>
            </div>

            {/* ==================================
                BOOKING SUMMARY
            ================================== */}

            <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-900">
                Booking Summary
              </h2>

              {/* VENUE */}

              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Venue
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {venue?.name || "--"}
                </p>
              </div>

              {/* DATE */}

              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Event Date
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {displayDate}
                </p>
              </div>

              {/* BOOKING TYPE */}

              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Booking Type
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {bookingType ===
                  "daily"
                    ? "Full Day"
                    : "Hourly"}
                </p>
              </div>

              {/* TIME */}

              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Time
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {bookingType ===
                  "daily"
                    ? "Full Day"
                    : formatTimeRange(
                        startTime,
                        endTime
                      )}
                </p>
              </div>

              {/* GUEST COUNT */}

              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Guests
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {guestCount || "--"}{" "}
                  Guests
                </p>
              </div>

              {/* ==================================
                  PRICE SUMMARY
              ================================== */}

              <div className="mt-6 space-y-3 border-t border-gray-200 pt-5">

                {/* TOTAL */}

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Total Amount
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹
                    {Number(
                      totalAmount || 0
                    ).toLocaleString()}
                  </span>
                </div>

                {/* PAID AMOUNT FOR EXISTING BOOKING */}

                {isPayingRemainingBalance && (
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                      Paid Amount
                    </span>

                    <span className="font-semibold text-gray-900">
                      ₹
                      {Number(
                        state.paidAmount ||
                          totalAmount -
                            remainingAmount ||
                          0
                      ).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* ADVANCE */}

                {!isPayingRemainingBalance && (
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-gray-500">
                      Advance Amount
                    </span>

                    <span className="font-semibold text-gray-900">
                      ₹
                      {Number(
                        advanceAmount || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* REMAINING */}

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Remaining Balance
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹
                    {Number(
                      remainingAmount || 0
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* ==================================
                  PAY NOW
              ================================== */}

              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-4">

                  <span className="font-semibold text-gray-900">
                    {isPayingRemainingBalance
                      ? "Balance to Pay"
                      : "Pay Now"}
                  </span>

                  <span className="text-xl font-bold text-gray-900">
                    ₹
                    {selectedPaymentAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* ==================================
                  REMAINING PAYMENT MESSAGE
              ================================== */}

              {isPayingRemainingBalance && (
                <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm leading-5 text-blue-800">
                    This payment is for the remaining
                    balance of your existing booking.
                    No new reservation is required.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}