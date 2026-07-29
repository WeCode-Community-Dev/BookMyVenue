import BookingStatCard from "./BookingStatCard";

const BookingStats = ({ bookings = [] }) => {
  const total = bookings.length;

  const pending = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === "pending"
  ).length;

  const confirmed = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === "confirmed"
  ).length;

  const completed = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === "completed"
  ).length;

  const cancelled = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === "cancelled"
  ).length;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

      <BookingStatCard
        title="Total"
        value={total}
        color="text-blue-600"
      />

      <BookingStatCard
        title="Pending"
        value={pending}
        color="text-orange-600"
      />

      <BookingStatCard
        title="Confirmed"
        value={confirmed}
        color="text-green-600"
      />

      <BookingStatCard
        title="Completed"
        value={completed}
        color="text-blue-600"
      />

      <BookingStatCard
        title="Cancelled"
        value={cancelled}
        color="text-red-600"
      />

    </div>
  );
};

export default BookingStats;