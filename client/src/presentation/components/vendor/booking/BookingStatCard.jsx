import React from "react";

const BookingStatCard = ({ title, value, color }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <h2 className={`text-3xl font-bold ${color}`}>
        {value}
      </h2>

      <p className="text-gray-500">
        {title}
      </p>
    </div>
  );
};

export default BookingStatCard;