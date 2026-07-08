import React, { useEffect, useState } from "react";
import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
import BookingHeader from "@/presentation/components/vendor/booking/BookingHeader";
import BookingStats from "@/presentation/components/vendor/booking/BookingStats";
import BookingFilters from "@/presentation/components/vendor/booking/BookingFilters";
import BookingTable from "@/presentation/components/vendor/booking/BookingTable";
import BookingPagination from "@/presentation/components/vendor/booking/BookingPagination";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get(API_ROUTES.VENDOR.BOOKINGS, {
          params: { page: 1, limit: 20 },
        });
        const payload = response?.data?.data || {};
        setBookings(payload.bookings || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <VendorSidebar />

      <div className="flex-1">
        <VendorNavbar />

        <main className="p-6">
          <BookingHeader />
          <BookingStats />
          <BookingFilters />

          {error && <p className="my-4 text-sm text-red-500">{error}</p>}
          {loading && <p className="my-4 text-sm text-gray-500">Loading bookings...</p>}

          <BookingTable bookings={bookings} loading={loading} error={error} />
          <BookingPagination />
        </main>
      </div>
    </div>
  );
};

export default Bookings;