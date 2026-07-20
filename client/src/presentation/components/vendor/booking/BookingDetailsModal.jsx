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
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        {detailsLoading ? (
          <p className="py-10 text-center">Loading...</p>
        ) : !bookingDetails ? (
          <p className="py-10 text-center">No booking selected.</p>
        ) : (
          <div className="grid grid-cols-2 gap-6">

            <div>
              <h3 className="font-semibold mb-2">Customer</h3>

              <p>Name : {bookingDetails.user?.fullName}</p>
              <p>Email : {bookingDetails.user?.email}</p>
              <p>Phone : {bookingDetails.user?.phone}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Venue</h3>

              <p>{bookingDetails.venue?.name}</p>
              <p>{bookingDetails.eventType}</p>
              <p>{bookingDetails.eventDate}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Booking</h3>

              <p>Guests : {bookingDetails.guestCount}</p>
              <p>Status : {bookingDetails.status}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Payment</h3>

              <p>Total : ₹{bookingDetails.totalAmount}</p>
              <p>Payment : {bookingDetails.paymentStatus}</p>
            </div>

          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;