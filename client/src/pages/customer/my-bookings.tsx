import { Link } from "react-router-dom";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyBookings } from "@/hooks/use-booking";
import type { BookingStatus } from "@/types/booking.types";
import { PUBLIC_ROUTES } from "@/routes/common/route-path";

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

const timeFmt = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

const statusClass: Record<BookingStatus, string> = {
  CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  CANCELED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  REFUNDED: "bg-muted text-muted-foreground",
};

const MyBookings = () => {
  const { data: bookings, isLoading } = useMyBookings();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold">My Bookings</h1>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-muted-foreground">You haven't booked any venues yet.</p>
            <Button asChild>
              <Link to={PUBLIC_ROUTES.VENUES}>Browse venues</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {bookings.map((booking) => (
              <Card key={booking._id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">
                      {booking.venue?.name ?? "Venue"}
                    </CardTitle>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusClass[booking.bookingStatus]}`}>
                      {booking.bookingStatus}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
                  {booking.venue?.city && <span>{booking.venue.city}</span>}
                  <span>{dateFmt.format(new Date(booking.startTime))}</span>
                  <span>
                    {timeFmt.format(new Date(booking.startTime))} –{" "}
                    {timeFmt.format(new Date(booking.endTime))}
                  </span>
                  <span className="font-medium text-foreground">₹{booking.totalAmount}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;
