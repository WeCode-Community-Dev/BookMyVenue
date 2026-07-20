import { useNavigate } from "react-router-dom";

const WelcomeBanner = ({ dashboard }) => {
  const navigate = useNavigate();

  const vendorName =
    dashboard?.vendorName || "Vendor";

  const pendingBookings =
    dashboard?.pendingBookings || 0;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold mb-2">
          Good morning, {vendorName}! 👋
        </h2>

        <p className="text-blue-100">
          You have{" "}
          <span className="font-semibold">
            {pendingBookings} pending bookings
          </span>{" "}
          awaiting your approval today.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/vendor/venues/add")}
          className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100"
        >
          + Add Venue
        </button>

        <button
          onClick={() => navigate("/vendor/bookings")}
          className="border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600"
        >
          Review Bookings
        </button>
      </div>
    </div>
  );
};

export default WelcomeBanner;