import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";

export default function PaymentFailure() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-6">

          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">

            <div className="text-6xl mb-5">
              ❌
            </div>

            <h1 className="text-3xl font-bold">
              Payment Failed
            </h1>

            <p className="text-gray-500 mt-3">
              We couldn't process your payment.
              Please try again.
            </p>

            <div className="flex flex-col gap-4 mt-8">

              <button
                onClick={() =>
                  navigate(ROUTES.USER.PAYMENT, {
                                        state: {
                      venue,
                      selectedPackage,
                      bookingDate,
                      startTime,
                      endTime,
                      guestCount,
                      totalAmount,
                    },

                  })
                }
                className="w-full bg-black text-white py-3 rounded-xl font-semibold"
              >
                Try Again
              </button>

              <button
                onClick={() =>
                  navigate(ROUTES.USER.BOOKING_SUMMARY, {
                                        state: {
                      venue,
                      selectedPackage,
                      bookingDate,
                      startTime,
                      endTime,
                      guestCount,
                      totalAmount,
                    },

                  })
                }
                className="w-full border py-3 rounded-xl font-semibold"
              >
                Back to Booking Summary
              </button>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}