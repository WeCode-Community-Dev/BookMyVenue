import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings,fetchBookingById } from "@/redux/slices/VendorBookingSlice";
import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";
import BookingHeader from "@/presentation/components/vendor/booking/BookingHeader";
import BookingStats from "@/presentation/components/vendor/booking/BookingStats";
import BookingFilters from "@/presentation/components/vendor/booking/BookingFilters";
import BookingTable from "@/presentation/components/vendor/booking/BookingTable";
import BookingPagination from "@/presentation/components/vendor/booking/BookingPagination";
import BookingDetailsModal from "@/presentation/components/vendor/booking/BookingDetailsModal";
const Bookings = () => {
const dispatch = useDispatch();
const [isModalOpen, setIsModalOpen] = useState(false);

const {
  bookings,
  loading,
  error,
  pagination,
} = useSelector((state) => state.vendorBooking);

const handleViewBooking = (bookingId) => {
  dispatch(fetchBookingById(bookingId));
  setIsModalOpen(true);
};


useEffect(() => {
  dispatch(fetchBookings({ page: 1, limit: 20 }));
}, [dispatch]);

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

          <BookingTable 
          bookings={bookings} 
          loading={loading} 
          error={error}
          onView={handleViewBooking} />
          <BookingPagination pagination={pagination} />

          <BookingDetailsModal
  open={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    dispatch(clearBookingDetails());
  }}
/>
        </main>
      </div>
    </div>
  );
};

export default Bookings;