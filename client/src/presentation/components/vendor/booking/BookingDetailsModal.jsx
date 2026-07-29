import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const BookingDetailsModal = ({
  open,
  onClose,
  booking,
  loading,
}) => {
  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            Booking Details
          </DialogTitle>

          <DialogDescription>
            View the complete details of this booking.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">
              Loading booking details...
            </p>
          </div>
        ) : !booking ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">
              Booking details not found.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ==============================
                BOOKING INFORMATION
            ============================== */}

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Booking Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-sm text-gray-500">
                    Booking ID
                  </p>

                  <p className="break-all font-medium">
                    {booking.booking?.id || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <p className="font-medium">
                    {booking.customer?.name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Venue
                  </p>

                  <p className="font-medium">
                    {booking.venue?.name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Event Date
                  </p>

                  <p className="font-medium">
                    {formatDate(
                      booking.booking?.bookingDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Guests
                  </p>

                  <p className="font-medium">
                    {booking.booking?.guestCount || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Booking Status
                  </p>

                  <p className="font-medium capitalize">
                    {booking.booking?.status || "-"}
                  </p>
                </div>

              </div>
            </div>


            {/* ==============================
                CUSTOMER INFORMATION
            ============================== */}

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Customer Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="break-all font-medium">
                    {booking.customer?.email || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-medium">
                    {booking.customer?.phone || "-"}
                  </p>
                </div>

              </div>
            </div>


            {/* ==============================
                EVENT TIMING
            ============================== */}

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Event Timing
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-sm text-gray-500">
                    Start Time
                  </p>

                  <p className="font-medium">
                    {booking.booking?.startTime || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    End Time
                  </p>

                  <p className="font-medium">
                    {booking.booking?.endTime || "-"}
                  </p>
                </div>

              </div>
            </div>


            {/* ==============================
                PAYMENT SUMMARY
            ============================== */}

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Payment Summary
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                {/* TOTAL */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Total Amount
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {formatAmount(
                      booking.payment?.totalAmount
                    )}
                  </p>
                </div>


                {/* PAID */}
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-gray-500">
                    Paid Amount
                  </p>

                  <p className="mt-1 text-xl font-semibold text-green-600">
                    {formatAmount(
                      booking.payment?.paidAmount ??
                      booking.payment?.advanceAmount
                    )}
                  </p>
                </div>


                {/* REMAINING */}
                <div className="rounded-lg bg-orange-50 p-4">
                  <p className="text-sm text-gray-500">
                    Remaining Amount
                  </p>

                  <p className="mt-1 text-xl font-semibold text-orange-600">
                    {formatAmount(
                      booking.payment?.remainingAmount
                    )}
                  </p>
                </div>

              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Payment Status
                </p>

                <p className="font-medium capitalize">
                  {booking.payment?.paymentStatus || "-"}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ==============================
            CLOSE BUTTON
        ============================== */}

        <DialogFooter className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Close
          </button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;