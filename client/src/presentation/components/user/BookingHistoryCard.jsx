import { ChevronRight, Calendar, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  pending: "bg-yellow-100 text-yellow-700",
};

const BookingHistoryCard = ({ booking }) => {
  const navigate = useNavigate();

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      onClick={() => navigate(`/user/bookings/${booking.id}`)}
      className="cursor-pointer border rounded-2xl p-4 flex justify-between hover:shadow-lg transition"
    >
      <div className="flex gap-5">
        <img
          src={booking.venueId.images?.[0]?.url}
          alt={booking.venueId.name}
          className="w-40 h-28 rounded-xl object-cover"
        />

        <div>
          <h2 className="font-bold text-xl">{booking.venueId.name}</h2>

          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <MapPin size={15} />
            {booking.venueId.address.city}, {booking.venueId.address.state}
          </div>

          <div className="flex gap-8 mt-4 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {formatDate(booking.bookingDate)}
            </div>

            <div className="flex items-center gap-2">
              <Users size={16} />
              {booking.guestCount} Guests
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              statusStyles[booking.status]
            }`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>

          <p className="font-bold text-xl mt-5">
            ₹{booking.totalAmount.toLocaleString()}
          </p>
        </div>

        <ChevronRight className="text-gray-400" size={24} />
      </div>
    </div>
  );
};

export default BookingHistoryCard;
