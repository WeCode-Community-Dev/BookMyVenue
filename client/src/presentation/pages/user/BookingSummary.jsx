import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";

export default function BookingSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <>
        <Header />

        <main className="min-h-screen flex items-center justify-center">
          <p> Booking details not found.</p>
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
  } = state;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-6">

          <h1 className="text-3xl font-bold">
            Booking Summary
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

            {/* Booking Details */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-6">
                Booking Details
              </h2>

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
                    📍 {venue.address?.city},{" "}
                    {venue.address?.state}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">

                <div>
                  <p className="text-gray-500 text-sm">
                    Event Date
                  </p>

                  <p className="font-semibold">
                    {bookingDate}
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
                    Start Time
                  </p>

                  <p className="font-semibold">
                    {startTime}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    End Time
                  </p>

                  <p className="font-semibold">
                    {endTime}
                  </p>
                </div>
                

              </div>

            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-2xl p-6 h-fit">

              <h2 className="text-xl font-bold">
                Price Summary
              </h2>

              <div className="flex justify-between mt-6">
                <span>
                  {selectedPackage?.name || "Venue price"}
                </span>

                <span>
                  ₹{selectedPackage?.price || venue.pricePerDay}
                </span>
              </div>
              <div className="border-t mt-5 pt-5 flex justify-between font-bold text-lg">
                <span>Total</span>

                <span>
                    ₹{selectedPackage?.price || venue.pricePerDay}
                </span>
              </div>

              <button
                onClick={() =>
                  navigate(ROUTES.USER.PAYMENT,{
                    state:{
                      venue,selectedPackage,bookingDate,startTime,endTime,guestCount
                    },
                  })
                }
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