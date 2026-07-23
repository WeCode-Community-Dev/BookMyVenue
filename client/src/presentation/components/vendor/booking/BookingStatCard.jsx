const BookingStatCard = ({ title, value, color }) => {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow">
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