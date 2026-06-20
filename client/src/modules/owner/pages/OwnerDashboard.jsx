import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { fetchMyVenuesApi } from "../../venues/api/venue.api";
import { fetchOwnerBookingsApi } from "../../bookings/api/bookings.api";

import SetupAlert from "../components/SetupAlert";

const OwnerDashboard = () => {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        venuesResponse,
        bookingsResponse,
      ] = await Promise.all([
        fetchMyVenuesApi(),
        fetchOwnerBookingsApi(),
      ]);

      setVenues(venuesResponse.data || []);
      setBookings(bookingsResponse.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const incompleteVenues = venues.filter(
    (venue) =>
      !venue.address ||
      !venue.description ||
      !venue.capacity ||
      !venue.price ||
      !venue.images?.length
  );

  const revenue = bookings.reduce(
    (total, booking) =>
      total + Number(booking.totalPrice || 0),
    0
  );

  return (
      <div className="max-w-7xl mx-auto px-5 py-10 mt-20">
        <SetupAlert
          incompleteVenues={incompleteVenues}
        />

        <div className="grid md:grid-cols-3 gap-5">

          <div className="border rounded-2xl p-6">

            <p className="text-gray-500">
              Total Venues
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {venues.length}
            </h2>

          </div>

          <div className="border rounded-2xl p-6">

            <p className="text-gray-500">
              Total Bookings
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {bookings.length}
            </h2>

          </div>

          <div className="border rounded-2xl p-6">

            <p className="text-gray-500">
              Revenue
            </p>

            <h2 className="text-4xl font-bold mt-2">
              ₹{revenue.toLocaleString()}
            </h2>

          </div>

        </div>

      </div>
  );
};

export default OwnerDashboard;