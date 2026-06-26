import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { upcomingBookings } from "@/lib/data/dashboard";

import { BookingStatusBadge } from "./booking-status-badge";

export function UpcomingBookingsTable() {
  return (
    <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-0">
        <CardTitle className="text-base font-semibold text-on-surface">
          Upcoming Bookings
        </CardTitle>
        <Link
          href="#"
          className="text-sm font-medium text-surface-tint hover:underline"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="px-6 pt-4 pb-6">
        <Table>
          <TableHeader>
            <TableRow className="border-outline-variant/40 hover:bg-transparent">
              <TableHead className="text-on-surface-variant">Customer</TableHead>
              <TableHead className="text-on-surface-variant">Space</TableHead>
              <TableHead className="text-on-surface-variant">Date</TableHead>
              <TableHead className="text-on-surface-variant">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingBookings.map((booking) => (
              <TableRow
                key={`${booking.customer}-${booking.date}`}
                className="border-outline-variant/40"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-surface-container text-xs font-medium text-on-surface">
                        {booking.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-on-surface">
                      {booking.customer}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-on-surface-variant">
                  {booking.space}
                </TableCell>
                <TableCell className="text-on-surface-variant">
                  {booking.date}
                </TableCell>
                <TableCell>
                  <BookingStatusBadge status={booking.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
