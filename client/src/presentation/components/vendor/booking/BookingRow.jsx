import { Eye } from "lucide-react";

const BookingRow = ({ booking, onView }) => {
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US");
  };

  const formatAmount = (amount) => {
    if (
      amount === undefined ||
      amount === null
    ) {
      return "-";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-600";

      case "pending":
        return "bg-yellow-100 text-yellow-600";

      case "completed":
        return "bg-blue-100 text-blue-600";

      case "cancelled":
        return "bg-red-100 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPaymentClass = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-600";

      case "partial":
        return "bg-orange-100 text-orange-600";

      case "pending":
        return "bg-yellow-100 text-yellow-600";

      case "failed":
        return "bg-red-100 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ==============================
  // PAYMENT CALCULATIONS
  // ==============================

  const totalAmount = Number(
    booking.totalAmount || 0
  );

  const paidAmount = Number(
    booking.advanceAmount || 0
  );

  const remainingAmount =
    totalAmount - paidAmount;

  return (
    <tr className="border-b last:border-b-0 hover:bg-gray-50">
      {/* Booking ID */}
      <td className="px-4 py-4">
        <span className="font-medium text-blue-600">
          {booking.id?.slice(-6)}
        </span>
      </td>

      {/* Customer */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-700">
          {booking.userId?.fullName || "-"}
        </span>
      </td>

      {/* Venue */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-700">
          {booking.venueId?.name || "-"}
        </span>
      </td>

      {/* Event Date */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-700">
          {formatDate(booking.bookingDate)}
        </span>
      </td>

      {/* Total */}
      <td className="px-4 py-4">
        <span className="font-medium text-gray-800">
          {formatAmount(totalAmount)}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
            booking.status
          )}`}
        >
          {booking.status || "-"}
        </span>
      </td>

      {/* Payment */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPaymentClass(
            booking.paymentStatus
          )}`}
        >
          {booking.paymentStatus || "-"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <button
          type="button"
          onClick={() => onView(booking.id)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
        >
          <Eye size={16} />

          View
        </button>
      </td>
    </tr>
  );
};

export default BookingRow;