import { updateBookingStatusApi }
    from "../../bookings/api/bookings.api";

const BookingDetailsModal = ({
    booking,
    onClose,
    reloadBookings,
}) => {

    const handleStatusUpdate = async (
        status
    ) => {

        try {

            await updateBookingStatusApi(
                booking.id,
                {status}
             );

            await reloadBookings();

            onClose();

        } catch (error) {

            console.error(error);

            alert("Failed to update booking");

        }
    };

    return (

        <div
            className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
         "
        >

            <div
                className="
               bg-white
               rounded-2xl
               w-full
               max-w-2xl
               p-6
               max-h-[90vh]
               overflow-y-auto
            "
            >

                <div className="flex justify-between mb-6">

                    <h2 className="text-2xl font-bold">
                        Booking Details
                    </h2>

                    <button onClick={onClose}>
                        ✕
                    </button>

                </div>

                {/* Venue */}

                <div className="mb-6">

                    <h3 className="font-semibold text-lg">
                        Venue
                    </h3>

                    <p>{booking.venue?.name}</p>

                    <p className="text-gray-500">
                        {booking.venue?.city}
                    </p>

                </div>

                {/* Customer */}

                <div className="mb-6">

                    <h3 className="font-semibold text-lg">
                        Customer
                    </h3>

                    <p>{booking.user?.name}</p>

                    <p>{booking.user?.email}</p>

                    <p>{booking.user?.phone}</p>

                </div>

                {/* Booking */}

                <div className="mb-6">

                    <h3 className="font-semibold text-lg mb-2">
                        Booking Information
                    </h3>

                    <div className="space-y-2">

                        <p>
                            <strong>Start Date:</strong>{" "}
                            {new Date(
                                booking.startDate
                            ).toLocaleDateString()}
                        </p>

                        <p>
                            <strong>End Date:</strong>{" "}
                            {new Date(
                                booking.endDate
                            ).toLocaleDateString()}
                        </p>

                        <p>
                            <strong>Guests:</strong>{" "}
                            {booking.guestCount}
                        </p>

                        <p>
                            <strong>Event Type:</strong>{" "}
                            {booking.eventType}
                        </p>

                        <p>
                            <strong>Total Price:</strong>{" "}
                            ₹{booking.totalPrice}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {booking.status}
                        </p>

                    </div>

                </div>

                {booking.notes && (

                    <div className="mb-6">

                        <h3 className="font-semibold mb-2">
                            Notes
                        </h3>

                        <p className="text-gray-600">
                            {booking.notes}
                        </p>

                    </div>

                )}

                {/* Actions */}

                {booking.status ===
                    "PENDING" && (

                        <div className="flex justify-end gap-3 border-t pt-5">

                            <button
                                onClick={() => handleStatusUpdate("REJECTED")}
                                className="
      px-5
      py-2
      rounded-xl
      bg-red-600
      text-white
      hover:bg-red-700
    "
                            >
                                Reject
                            </button>

                            <button
                                onClick={() => handleStatusUpdate("CONFIRMED")}
                                className="
      px-5
      py-2
      rounded-xl
      bg-green-600
      text-black
      hover:bg-green-700
    "
                            >
                                Approve
                            </button>

                        </div>

                    )}

            </div>

        </div>

    );
};

export default BookingDetailsModal;