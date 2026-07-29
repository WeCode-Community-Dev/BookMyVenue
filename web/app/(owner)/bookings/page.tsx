import { BookingsPageHeader } from "@/components/bookings/bookings-page-header";
import { OwnerBookingsTable } from "@/components/bookings/owner-bookings-table";

export default function BookingsPage() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <BookingsPageHeader />
      <OwnerBookingsTable />
    </div>
  );
}
