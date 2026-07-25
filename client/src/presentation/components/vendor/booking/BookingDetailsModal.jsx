import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";

const BookingDetailsModal = ({ open, onClose }) => {
  const {
    bookingDetails,
    detailsLoading,
  } = useSelector((state) => state.vendorBooking);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Booking Details
          </DialogTitle>
        </DialogHeader>

        {detailsLoading ? (
          <p className="py-10 text-center">
            Loading...
          </p>
        ) : !bookingDetails ? (
          <p className="py-10 text-center">
            No booking selected.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Customer */}
            <div>
              <h3 className="mb-2 font-semibold">
                Customer
              </h3>

              <p>
                Name: {bookingDetails.user?.fullName || "N/A"}
              </p>

              <p>
                Email: {bookingDetails.user?.email || "N/A"}
              </p>

              <p>
                Phone: {bookingDetails.user?.phone || "N/A"}
              </p>
            </div>

            {/* Venue */}
            <div>
              <h3 className="mb-2 font-semibold">
                Venue
              </h3>

              <p>
                {bookingDetails.venue?.name || "N/A"}
              </p>

              <p>
                Event Type: {bookingDetails.eventType || "N/A"}
              </p>

              <p>
                Event Date: {bookingDetails.eventDate || "N/A"}
              </p>
            </div>

            {/* Booking */}
            <div>
              <h3 className="mb-2 font-semibold">
                Booking
              </h3>

              <p>
                Guests: {bookingDetails.guestCount || 0}
              </p>

              <p>
                Status: {bookingDetails.status || "N/A"}
              </p>
            </div>

            {/* Payment */}
            <div>
              <h3 className="mb-2 font-semibold">
                Payment
              </h3>

              <p>
                Total: ₹{bookingDetails.totalAmount || 0}
              </p>

              <p>
                Payment: {bookingDetails.paymentStatus || "N/A"}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;