import React from "react";
import BookingStatCard from "./BookingStatCard";

const BookingStats = () => {
  return (
    <div className="grid grid-cols-5 gap-4 mb-6">

      <BookingStatCard
        title="Total"
        value="8"
        color="text-blue-600"
      />

      <BookingStatCard
        title="Pending"
        value="2"
        color="text-orange-600"

      />

      <BookingStatCard
        title="Confirmed"
        value="2"
        color="text-green-600"

      />

      <BookingStatCard
        title="Completed"
        value="3"
        color="text-blue-600"

      />

      <BookingStatCard
        title="Cancelled"
        value="1"
        color="text-red-600"

      />

    </div>
  );
};

export default BookingStats;