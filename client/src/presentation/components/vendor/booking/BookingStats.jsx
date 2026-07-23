import BookingStatCard from "./BookingStatCard";

const BookingStats = () => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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