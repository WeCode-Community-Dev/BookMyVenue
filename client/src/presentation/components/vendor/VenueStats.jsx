import React from "react";

const VenueStats = ({ guests, price, bookings }) => {
  return (
    <div className="flex justify-between text-sm text-gray-500">
      <span>{guests} Guests</span>
      <span>₹{price}/day</span>
      <span>{bookings} Bookings</span>
    </div>
  );
};

export default VenueStats;