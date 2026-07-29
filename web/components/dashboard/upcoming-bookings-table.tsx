"use client";

import { useEffect, useState } from "react";
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
import {
  getBookings,
  type BookingListItem,
} from "@/services/bookingServices";

import { BookingStatusBadge } from "./booking-status-badge";

function formatCustomerName(booking: BookingListItem): string {
  return `${booking.customer.firstName} ${booking.customer.lastName ?? ""}`.trim();
}

function formatCustomerInitials(booking: BookingListItem): string {
  const first = booking.customer.firstName.charAt(0);
  const last = booking.customer.lastName?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase();
}

function formatBookingDate(startAt: string): string {
  return new Date(startAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UpcomingBookingsTable() {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch {
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookings();
  }, []);

  return (
    <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-0">
        <CardTitle className="text-base font-semibold text-on-surface">
          Upcoming Bookings
        </CardTitle>
        <Link
          href="/bookings"
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
            {isLoading ? (
              <TableRow className="border-outline-variant/40">
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-on-surface-variant"
                >
                  Loading bookings...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow className="border-outline-variant/40">
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-on-surface-variant"
                >
                  No upcoming bookings
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="border-outline-variant/40"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-surface-container text-xs font-medium text-on-surface">
                          {formatCustomerInitials(booking)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-on-surface">
                        {formatCustomerName(booking)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-on-surface-variant">
                    {booking.space.name}
                  </TableCell>
                  <TableCell className="text-on-surface-variant">
                    {formatBookingDate(booking.startAt)}
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
