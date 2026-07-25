import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

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


  // ==============================
  // MODAL
  // ==============================

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);


  // ==============================
  // FILTER STATE
  // ==============================

  const [
    search,
    setSearch,
  ] = useState("");


  const [
    status,
    setStatus,
  ] = useState("");


  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  // ==============================
  // REDUX
  // ==============================

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

        page: currentPage,

        limit: 20,

        search,

        status,

      })
    );

  }, [
    dispatch,
    currentPage,
    search,
    status,
  ]);


  // ==============================
  // RESET PAGE WHEN FILTER CHANGES
  // ==============================

  useEffect(() => {

    setCurrentPage(1);

  }, [
    search,
    status,
  ]);


  // ==============================
  // VIEW BOOKING
  // ==============================

  const handleViewBooking = (bookingId) => {

    setIsModalOpen(true);

    dispatch(
      fetchBookingById(bookingId)
    );

  };


  // ==============================
  // CLOSE MODAL
  // ==============================

  const handleCloseModal = () => {

    setIsModalOpen(false);

    dispatch(
      clearBookingDetails()
    );

  };


  // ==============================
  // EXPORT CSV
  // ==============================

  const handleExport = () => {

    if (!bookings.length) {
      return;
    }


    const headers = [
      "Booking ID",
      "Customer",
      "Venue",
      "Event Date",
      "Total Amount",
      "Status",
      "Payment Status",
    ];


    const rows = bookings.map(
      (booking) => [

        booking.id,

        booking.userId?.fullName ||
        booking.customer?.name ||
        "-",

        booking.venueId?.name ||
        booking.venue?.name ||
        "-",

        booking.bookingDate,

        booking.totalAmount,

        booking.status,

        booking.paymentStatus,

      ]
    );


    const csvContent = [

      headers.join(","),

      ...rows.map(
        (row) =>
          row
            .map(
              (value) =>
                `"${value ?? ""}"`
            )
            .join(",")
      ),

    ].join("\n");


    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.setAttribute(
      "download",
      "vendor-bookings.csv"
    );


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  };


  return (

    <div className="flex min-h-screen bg-slate-100">

      <VendorSidebar />


      <div className="flex-1">

        <VendorNavbar />


        <main className="p-6">

          <BookingHeader />


          <BookingStats bookings={bookings } />


          {/* =========================
              FILTERS
          ========================= */}

          <BookingFilters

            search={search}

            setSearch={setSearch}

            status={status}

            setStatus={setStatus}

            onExport={handleExport}

          />


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

            currentPage={currentPage}

            setCurrentPage={setCurrentPage}

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