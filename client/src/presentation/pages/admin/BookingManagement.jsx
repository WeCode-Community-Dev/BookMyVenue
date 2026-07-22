import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/presentation/components/admin/common/PageHeader";
import BookingFilters from "@/presentation/components/admin/bookingManagement/BookingFilters";
import BookingStats from "@/presentation/components/admin/bookingManagement/BookingStats";
import BookingTable from "@/presentation/components/admin/bookingManagement/BookingTable";

import Pagination from "@/presentation/components/common/Pagination";

import useDebounce from "@/hooks/useDebounce";

import {
  getBookings,
  getBookingStats,
} from "@/redux/slices/AdminBookingSlice";

const BookingManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    bookings,
    statistics,
    loading,
    error,
    pagination,
  } = useSelector((state) => state.adminBooking);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const limit = 10;

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(
      getBookings({
        search: debouncedSearch,
        status,
        paymentStatus,
        page,
        limit,
      })
    );
  }, [
    dispatch,
    debouncedSearch,
    status,
    paymentStatus,
    page,
  ]);

  useEffect(() => {
    dispatch(getBookingStats());
  }, [dispatch]);

  const handleView = (booking) => {
    navigate(`/admin/bookings/${booking._id}`);
  };

  return (
    <div>
      <PageHeader
        title="Booking Management"
        subtitle="Manage platform bookings"
      />
      <div className="mb-8">

      <BookingStats stats={statistics} />
      </div>

      <BookingFilters
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        status={status}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={(value) => {
          setPaymentStatus(value);
          setPage(1);
        }}
      />

      {loading ? (
        <div className="text-center py-10">
          Loading...
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">
          {error}
        </div>
      ) : (
        <>
          <BookingTable
            bookings={bookings}
            onView={handleView}
          />

          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BookingManagement;