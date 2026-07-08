import { ChevronRight, Calendar, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  Upcoming: "bg-green-100 text-green-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

const BookingHistoryCard = ({ booking }) => {

    const navigate = useNavigate();

    return (

        <div
            onClick={() => navigate(`/user/bookings/${booking.id}`)}
            className="cursor-pointer border rounded-2xl p-4 flex justify-between hover:shadow-lg transition"
        >

      <div className="flex gap-5">

        <img
          src={booking.image}
          alt={booking.venueName}
          className="w-40 h-28 rounded-xl object-cover"
        />

        <div>

          <h2 className="font-bold text-xl">
            {booking.venueName}
          </h2>

          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <MapPin size={15} />
            {booking.location}
          </div>

          <div className="flex gap-8 mt-4 text-gray-600 text-sm">

            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {booking.bookingDate}
            </div>

            <div className="flex items-center gap-2">
              <Users size={16} />
              {booking.guests} Guests
            </div>

          </div>

        </div>

      </div>

      <div className="flex items-center gap-6">

        <div className="text-right">

          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${statusStyles[booking.status]}`}
          >
            {booking.status}
          </span>

          <p className="font-bold text-xl mt-5">
            ₹{booking.amount.toLocaleString()}
          </p>

        </div>

        <ChevronRight
          className="text-gray-400"
          size={24}
        />

      </div>

    </div>
  );
};

export default BookingHistoryCard;