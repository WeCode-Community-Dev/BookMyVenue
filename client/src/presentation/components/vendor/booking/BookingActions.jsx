import { Eye, Check, X } from "lucide-react";

const BookingActions = ({
  bookingId,
  status,
  onView,
  onApprove,
  onReject,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* View */}
      <button
        type="button"
        onClick={() => onView?.(bookingId)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-gray-50"
      >
        <Eye size={16} />
      </button>

      {/* Pending Actions */}
      {status === "Pending" && (
        <>
          <button
            type="button"
            onClick={() => onApprove?.(bookingId)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
          >
            <Check size={16} />
          </button>

          <button
            type="button"
            onClick={() => onReject?.(bookingId)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
          >
            <X size={16} />
          </button>
        </>
      )}
    </div>
  );
};

export default BookingActions;