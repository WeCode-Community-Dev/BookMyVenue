import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchBookings,
  fetchBookingById,
  clearBookingDetails,
} from "@/redux/slices/VendorBookingSlice";

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
    totalPages,
    totalCount,
    bookingDetails,
    detailsLoading,
  } = useSelector(
    (state) => state.vendorBooking
  );

  // ==============================
  // FETCH BOOKINGS
  // ==============================

  useEffect(() => {
    dispatch(
      fetchBookings({
        page: 1,
        limit: 20,
      })
    );
  }, [dispatch]);

  // ==============================
  // VIEW BOOKING
  // ==============================

  const handleViewBooking = (bookingId) => {
    setIsModalOpen(true);

    dispatch(fetchBookingById(bookingId));
  };

  // ==============================
  // CLOSE MODAL
  // ==============================

  const handleCloseModal = () => {
    setIsModalOpen(false);

    dispatch(clearBookingDetails());
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <VendorSidebar />

      <div className="flex-1">
        <VendorNavbar />

        <main className="p-6">
          <BookingHeader />

          <BookingStats />

          <BookingFilters />

          {error && (
            <p className="my-4 text-sm text-red-500">
              {error}
            </p>
          )}

          <BookingTable
            bookings={bookings}
            loading={loading}
            error={error}
            onView={handleViewBooking}
          />

          <BookingPagination
            totalPages={totalPages}
            totalCount={totalCount}
          />

          <BookingDetailsModal
            open={isModalOpen}
            onClose={handleCloseModal}
            booking={bookingDetails}
            loading={detailsLoading}
          />
        </main>
      </div>
    </div>
  );
};

export default Bookings;