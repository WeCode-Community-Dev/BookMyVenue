import { ChevronLeft, ChevronRight } from "lucide-react";

const BookingPagination = () => {
  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing 8 of 8 bookings
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border hover:bg-gray-50"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          className="h-10 w-10 rounded-lg bg-blue-600 font-medium text-white"
        >
          1
        </button>

        <button
          type="button"
          className="h-10 w-10 rounded-lg border hover:bg-gray-50"
        >
          2
        </button>

        <button
          type="button"
          className="h-10 w-10 rounded-lg border hover:bg-gray-50"
        >
          3
        </button>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border hover:bg-gray-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default BookingPagination;