import React from "react";
import { Eye, Check, X } from "lucide-react";

const BookingActions = ({ status }) => {
  return (
    <div className="flex items-center gap-2">

      {/* View */}
      <button className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50">
        <Eye size={16} />
      </button>

      {/* Pending Actions */}
      {status === "Pending" && (
        <>
          <button className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200">
            <Check size={16} />
          </button>

          <button className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200">
            <X size={16} />
          </button>
        </>
      )}

    </div>
  );
};

export default BookingActions;