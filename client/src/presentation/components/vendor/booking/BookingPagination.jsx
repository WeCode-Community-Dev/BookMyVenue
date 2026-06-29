import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BookingPagination = () => {
  return (
    <div className="flex justify-between items-center mt-6">

      <p className="text-sm text-gray-500">
        Showing 8 of 8 bookings
      </p>

      <div className="flex items-center gap-2">

        <button className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-50">
          <ChevronLeft size={16} />
        </button>

        <button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-medium">
          1
        </button>

        <button className="w-10 h-10 rounded-lg border hover:bg-gray-50">
          2
        </button>

        <button className="w-10 h-10 rounded-lg border hover:bg-gray-50">
          3
        </button>

        <button className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-50">
          <ChevronRight size={16} />
        </button>

      </div>

    </div>
  );
};

export default BookingPagination;