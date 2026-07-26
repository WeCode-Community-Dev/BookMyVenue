import Header from "@/presentation/components/common/Header";
import UserSidebar from "@/presentation/components/user/UserSidebar";
import { ArrowLeft, Calendar, Users, CreditCard, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getBookingById, cancelBooking } from "@/redux/slices/UserBookingSlice";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const BookingDetails = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const dispatch = useDispatch();

  const { booking, loading } = useSelector((state) => state.userBooking);

  useEffect(() => {
    dispatch(getBookingById(bookingId));
  }, [dispatch, bookingId]);

  const handleCancelBooking = async () => {
    const result = await Swal.fire({
      title: "Cancel Booking",
      text: "Are you sure you want to cancel this booking?",
      input: "textarea",
      inputLabel: "Cancellation Reason",
      inputPlaceholder: "Enter the reason for cancellation...",
      inputAttributes: {
        "aria-label": "Cancellation reason",
      },
      showCancelButton: true,
      confirmButtonText: "Cancel Booking",
      cancelButtonText: "Keep Booking",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,

      inputValidator: (value) => {
        if (!value) {
          return "Cancellation reason is required";
        }

        if (value.trim().length < 10) {
          return "Please enter at least 10 characters";
        }

        return null;
      },
    });

    if (!result.isConfirmed) return;

    try {
      await dispatch(
        cancelBooking({
          bookingId,
          cancellationReason: result.value,
        })
      ).unwrap();

      toast.success(
        "Your booking has been cancelled successfully. The refund amount will be credited to your account within 24 hours."
      );

      dispatch(getBookingById(bookingId));
    } catch (error) {
      console.log(error);

      toast.error(
        typeof error === "string"
          ? error
          : error.message || "Failed to cancel booking"
      );
    }
  };

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
                    value={`BMV-${booking.id
                      .slice(0, 6)
                      .toUpperCase()}-${booking.id.slice(-4).toUpperCase()}`}
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
                    label="Total Amount"
                    value={`₹${booking.totalAmount.toLocaleString()}`}
                  />

                  <InfoRow
                    label="Paid Amount"
                    value={`₹${booking.paidAmount.toLocaleString()}`}
                  />

                  <InfoRow
                    label="Remaining Amount"
                    value={`₹${booking.remainingAmount.toLocaleString()}`}
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

            <div className="mt-8">
              {booking.status?.toLowerCase() === "cancelled" ? (
                <div className="border border-red-200 bg-red-50 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-red-700">
                        Booking Cancelled
                      </h2>

                      <p className="text-gray-600 mt-2">
                        This booking has been cancelled successfully.
                      </p>

                      {booking.cancellationReason && (
                        <div className="mt-5 bg-white border rounded-xl p-4">
                          <p className="text-sm text-gray-500 font-medium mb-1">
                            Cancellation Reason
                          </p>

                          <p className="text-gray-700">
                            "{booking.cancellationReason}"
                          </p>
                        </div>
                      )}

                      <p className="text-sm text-gray-500 mt-5">
                        If you'd like to reserve this venue again, you can
                        create a new booking anytime.
                      </p>

                      <button
                        className="mt-5 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold"
                      >
                        Book Again
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <button className="border rounded-xl px-10 py-3 font-semibold hover:bg-gray-50">
                    Download Invoice
                  </button>

                  <div className="flex gap-4">
                    {booking.paymentStatus?.toLowerCase() === "partial" && (
                      <button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-8 py-3 font-semibold">
                        Pay Remaining ₹
                        {booking.remainingAmount.toLocaleString()}
                      </button>
                    )}

                    <button
                      onClick={handleCancelBooking}
                      className="border border-red-500 text-red-500 rounded-xl px-10 py-3 font-semibold hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              )}
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
