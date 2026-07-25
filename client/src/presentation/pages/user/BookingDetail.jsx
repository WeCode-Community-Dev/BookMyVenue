import Header from "@/presentation/components/common/Header";
import UserSidebar from "@/presentation/components/user/UserSidebar";
import { ArrowLeft, Calendar, Users, CreditCard, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getBookingById } from "@/redux/slices/UserBookingSlice";

const BookingDetails = () => {
  const { bookingId } = useParams();

  const dispatch = useDispatch();

  const { booking, loading } = useSelector((state) => state.userBooking);

  useEffect(() => {
    dispatch(getBookingById(bookingId));
  }, [dispatch, bookingId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex">
          <UserSidebar />
          <main className="flex-1 p-10">
            <h2>Loading booking...</h2>
          </main>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Header />
        <div className="flex">
          <UserSidebar />
          <main className="flex-1 p-10">
            <h2>Booking not found.</h2>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="flex">
        <UserSidebar />

        <main className="flex-1 bg-gray-50 p-10">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-500 mb-5"
          >
            <ArrowLeft size={18} />
            Back to Booking History
          </button>

          <div className="bg-white rounded-3xl shadow-md p-8">
            {/* Header */}

            <div className="flex justify-between">
              <div>
                <h1 className="text-3xl font-bold">Booking Details</h1>

                <p className="text-gray-500 mt-2">
                  View your booking information and details
                </p>
              </div>

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full h-fit">
                {booking?.status}
              </span>
            </div>

            {/* Card */}

            <div className="grid grid-cols-3 gap-8 mt-10 border rounded-3xl p-5">
              {/* Image */}

              <img
                src={booking.venueId.images?.[0]?.url}
                className="rounded-2xl h-full object-cover"
              />

              {/* Booking */}

              <div>
                <h2 className="font-bold text-xl mb-6">Booking Information</h2>

                <div className="space-y-5">
                  <InfoRow
                    icon={<CreditCard size={18} />}
                    label="Booking ID"
                    value={booking?.id}
                  />

                  <InfoRow
                    icon={<Calendar size={18} />}
                    label="Booking Date"
                    value={new Date(booking.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
                  />

                  <InfoRow
                    icon={<Calendar size={18} />}
                    label="Event Date"
                    value={new Date(booking.bookingDate).toLocaleDateString(
                      "en-GB"
                    )}
                  />

                  <InfoRow
                    icon={<Users size={18} />}
                    label="Guests"
                    value={`${booking.guestCount} Guests`}
                  />

                  <InfoRow
                    icon={<CreditCard size={18} />}
                    label="Amount Paid"
                    value={`₹${booking?.totalAmount.toLocaleString()}`}
                  />

                  <InfoRow
                    label="Payment Status"
                    value={booking?.paymentStatus}
                  />

                  <InfoRow label="Booking Status" value={booking?.status} />
                </div>
              </div>

              {/* Venue */}

              <div>
                <h2 className="font-bold text-xl mb-6">Venue Details</h2>

                <div className="flex gap-2">
                  <MapPin size={18} />

                  <div>
                    <h3 className="font-semibold">{booking.venueId.name}</h3>

                    <p className="text-gray-500">
                      {booking.venueId.address.city},{" "}
                      {booking.venueId.address.state}
                    </p>
                  </div>
                </div>

                <img
                  className="rounded-xl mt-5"
                  src="https://placehold.co/500x180?text=Map"
                />

                <div className="mt-5">
                  <h3 className="font-semibold mb-2">About Venue</h3>

                  <p className="text-gray-500">{booking?.venue?.description}</p>
                </div>
              </div>
            </div>

            {/* Buttons */}

            <div className="flex justify-between mt-8">
              <button className="border rounded-xl px-10 py-3 font-semibold hover:bg-gray-50">
                Download Invoice
              </button>

              <button className="border border-red-500 text-red-500 rounded-xl px-10 py-3 font-semibold hover:bg-red-50">
                Cancel Booking
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex justify-between border-b pb-3">
      <div className="flex gap-2 items-center text-gray-500">
        {icon}

        {label}
      </div>

      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default BookingDetails;
