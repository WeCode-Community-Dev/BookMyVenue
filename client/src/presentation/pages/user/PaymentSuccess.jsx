import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";
import { formatDateToDDMMYYYY } from "@/lib/utils";

export default function PaymentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <>
        <Header />

        <main className="min-h-screen flex items-center justify-center">
          <p>Payment details not found.</p>
        </main>

        <Footer />
      </>
    );
  }

  const {
    venue,
    selectedPackage,
    bookingDate,
    startTime,
    endTime,
    guestCount,
    totalAmount,
  } = state;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-6">

          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">

            <div className="text-6xl mb-5">
              ✅
            </div>

            <h1 className="text-3xl font-bold">
              Payment Successful!
            </h1>

            <p className="text-gray-500 mt-3">
              Your booking payment has been successfully processed.
            </p>

            <div className="border rounded-xl p-5 mt-8 text-left">

              <h2 className="text-xl font-bold mb-4">
                Booking Details
              </h2>

              <p className="font-semibold">
                {venue.name}
              </p>

              <p className="text-gray-500 mt-2">
                📍 {venue.address?.city},{" "}
                {venue.address?.state}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6">

                <div>
                  <p className="text-gray-500 text-sm">
                    Event Date
                  </p>

                  <p className="font-semibold">
                    {formatDateToDDMMYYYY(bookingDate)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Guests
                  </p>

                  <p className="font-semibold">
                    {guestCount}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Time
                  </p>

                  <p className="font-semibold">
                    {startTime} - {endTime}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Amount Paid
                  </p>

                  <p className="font-semibold">
                    ₹{totalAmount}
                  </p>
                </div>

              </div>

              {selectedPackage && (
                <div className="mt-5">
                  <p className="text-gray-500 text-sm">
                    Package
                  </p>

                  <p className="font-semibold">
                    {selectedPackage.name}
                  </p>
                </div>
              )}

            </div>

            <button
              onClick={() =>
                navigate(ROUTES.USER.BOOKINGS)
              }
              className="w-full mt-8 bg-black text-white py-3 rounded-xl font-semibold"
            >
              View My Bookings
            </button>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}