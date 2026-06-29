import VendorSidebar from "@/presentation/components/vendor/VendorSidebar";
import VendorNavbar from "@/presentation/components/vendor/VendorNavbar";

import BookingHeader from "@/presentation/components/vendor/booking/BookingHeader";
import BookingStats from "@/presentation/components/vendor/booking/BookingStats";
import BookingFilters from "@/presentation/components/vendor/booking/BookingFilters";
import BookingTable from "@/presentation/components/vendor/booking/BookingTable";
import BookingPagination from "@/presentation/components/vendor/booking/BookingPagination";

const Bookings = () => {
  return (
    <div className="flex bg-slate-100 min-h-screen">

      <VendorSidebar />

      <div className="flex-1">

        <VendorNavbar />

        <main className="p-6">

          <BookingHeader />

          <BookingStats />

          <BookingFilters />

          <BookingTable />

          <BookingPagination />

        </main>

      </div>

    </div>
  );
};

export default Bookings;