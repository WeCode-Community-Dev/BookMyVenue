import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";
import { formatDateToDDMMYYYY } from "@/lib/utils";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

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
    selectedPackage,
    bookingType,
    bookingDate,
    startTime,
    endTime,
    guestCount,
  } = state;

  const totalAmount =
    selectedPackage?.price || venue.pricePerDay;

  const paymentState = {
    venue,
    selectedPackage,
    bookingType,
    bookingDate,
    startTime,
    endTime,
    guestCount,
    totalAmount,
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

            {/* Payment Section */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold">
                Choose Payment Method
              </h2>

              <div className="border rounded-xl p-4 mt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                  />

                  <span className="font-medium">
                    UPI / Online Payment
                  </span>
                </label>
              </div>

              <div className="border rounded-xl p-4 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                  />

                  <span className="font-medium">
                    Credit / Debit Card
                  </span>
                </label>
              </div>

              <div className="flex flex-col gap-3 mt-8">

                {/* Successful Payment */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      ROUTES.USER.PAYMENT_SUCCESS,
                      { state: paymentState }
                    )
                  }
                  className="w-full bg-black text-white py-3 rounded-xl font-semibold"
                >
                  Simulate Successful Payment ₹{totalAmount}
                </button>

                {/* Failed Payment */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      ROUTES.USER.PAYMENT_FAILURE,
                      { state: paymentState }
                    )
                  }
                  className="w-full border border-red-500 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50"
                >
                  Simulate Failed Payment
                </button>

              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 h-fit">
              <h2 className="text-xl font-bold">
                Booking Summary
              </h2>

              <p className="font-semibold mt-5">
                {venue.name}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                {formatDateToDDMMYYYY(bookingDate)}
              </p>

              {/* Booking Type */}
              <p className="text-gray-500 text-sm mt-2">
                Booking Type:{" "}
                <span className="font-medium text-gray-700">
                  {bookingType === "fullDay"
                    ? "Full Day"
                    : "Hour Wise"}
                </span>
              </p>

              {/* Conditional Time Display */}
              {bookingType === "fullDay" ? (
                <p className="text-gray-500 text-sm mt-1">
                  Full day venue booking
                </p>
              ) : (
                <p className="text-gray-500 text-sm mt-1">
                  {startTime} - {endTime}
                </p>
              )}

              <p className="text-gray-500 text-sm mt-2">
                {guestCount} guests
              </p>

              <div className="border-t mt-5 pt-5 flex justify-between font-bold text-lg">
                <span>Total</span>

                <span>
                  ₹{totalAmount}
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}