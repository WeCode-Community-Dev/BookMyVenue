import { useNavigate } from "react-router-dom";

const WelcomeBanner = ({ dashboard }) => {
  const navigate = useNavigate();

  const vendorName = dashboard?.vendorName || "Vendor";

  const pendingBookings =
    dashboard?.pendingBookings || 0;

  return (
    <div className="rounded-2xl border-2 border-amber-500 bg-white p-8 flex items-center justify-between shadow-sm">

      <div>
        <h2 className="text-3xl font-bold mb-2 text-slate-900">
          Good morning, {vendorName}! 👋
        </h2>

        <p className="text-gray-600">
          You have{" "}
          <span className="font-semibold text-amber-600">
            {pendingBookings} pending bookings
          </span>{" "}
          awaiting your approval today.
        </p>
      </div>

      <div className="flex gap-4">

        <button
          onClick={() => navigate("/vendor/venues/add")}
          className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition"
        >
          + Add Venue
        </button>

        <button
          onClick={() => navigate("/vendor/bookings")}
          className="border border-amber-600 text-amber-600 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition"
        >
          Review Bookings
        </button>

      </div>

    </div>
  );
};

export default WelcomeBanner;