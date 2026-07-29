const BookingStatusBadge = ({ status }) => {
  const styles = {
    Confirmed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-600",
    Completed: "bg-blue-100 text-blue-600",
  };

  return (
    <span
      className={`rounded-full px-4 py-1 text-sm font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      ● {status}
    </span>
  );
};

export default BookingStatusBadge;