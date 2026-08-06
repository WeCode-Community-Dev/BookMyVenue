"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

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
import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { formatPricingAmount } from "@/lib/data/public-venue-detail";
import { cn } from "@/lib/utils";
import {
  getOwnerBookings,
  type BookingListItem,
  type BookingSortField,
} from "@/services/bookingServices";

type SortOrder = "asc" | "desc";

const SORTABLE_COLUMNS: { key: BookingSortField; label: string }[] = [
  { key: "bookingNumber", label: "Booking #" },
  { key: "startAt", label: "Date & Time" },
  { key: "guests", label: "Guests" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

function formatCustomerName(booking: BookingListItem): string {
  return `${booking.customer.firstName} ${booking.customer.lastName ?? ""}`.trim();
}

function formatCustomerInitials(booking: BookingListItem): string {
  const first = booking.customer.firstName.charAt(0);
  const last = booking.customer.lastName?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase();
}

function formatBookingDateTime(startAt: string, endAt: string): string {
  const start = new Date(startAt);
  const end = new Date(endAt);

  const datePart = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };

  const startTime = start.toLocaleTimeString("en-US", timeFormat);
  const endTime = end.toLocaleTimeString("en-US", timeFormat);

  return `${datePart}, ${startTime} – ${endTime}`;
}

function SortIcon({
  column,
  sortBy,
  sortOrder,
}: {
  column: BookingSortField;
  sortBy: BookingSortField;
  sortOrder: SortOrder;
}) {
  if (column !== sortBy) {
    return <ArrowUpDown className="size-3.5 opacity-50" />;
  }

  return sortOrder === "asc" ? (
    <ArrowUp className="size-3.5" />
  ) : (
    <ArrowDown className="size-3.5" />
  );
}

export function OwnerBookingsTable() {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<BookingSortField>("startAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getOwnerBookings({ sortBy, sortOrder });
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  function handleSort(column: BookingSortField) {
    if (sortBy === column) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(column);
    setSortOrder("desc");
  }

  const columnCount = 8;

  return (
    <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-0">
        <CardTitle className="text-base font-semibold text-on-surface">
          All Bookings
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pt-4 pb-6">
        <Table>
          <TableHeader>
            <TableRow className="border-outline-variant/40 hover:bg-transparent">
              <TableHead className="text-on-surface-variant">
                <button
                  type="button"
                  onClick={() => handleSort("bookingNumber")}
                  className={cn(
                    "inline-flex items-center gap-1.5 font-medium transition-colors hover:text-on-surface",
                    sortBy === "bookingNumber" && "text-on-surface",
                  )}
                >
                  Booking #
                  <SortIcon
                    column="bookingNumber"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </button>
              </TableHead>
              <TableHead className="text-on-surface-variant">Customer</TableHead>
              <TableHead className="text-on-surface-variant">Venue</TableHead>
              <TableHead className="text-on-surface-variant">Space</TableHead>
              {SORTABLE_COLUMNS.filter((column) => column.key !== "bookingNumber").map(
                (column) => (
                  <TableHead
                    key={column.key}
                    className="text-on-surface-variant"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      className={cn(
                        "inline-flex items-center gap-1.5 font-medium transition-colors hover:text-on-surface",
                        sortBy === column.key && "text-on-surface",
                      )}
                    >
                      {column.label}
                      <SortIcon
                        column={column.key}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                      />
                    </button>
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-outline-variant/40">
                <TableCell
                  colSpan={columnCount}
                  className="py-8 text-center text-on-surface-variant"
                >
                  Loading bookings...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow className="border-outline-variant/40">
                <TableCell
                  colSpan={columnCount}
                  className="py-8 text-center text-on-surface-variant"
                >
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="border-outline-variant/40"
                >
                  <TableCell className="font-medium text-on-surface">
                    {booking.bookingNumber}
                  </TableCell>
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
                    {booking.venue.name}
                  </TableCell>
                  <TableCell className="text-on-surface-variant">
                    {booking.space.name}
                  </TableCell>
                  <TableCell className="text-on-surface-variant">
                    {formatBookingDateTime(booking.startAt, booking.endAt)}
                  </TableCell>
                  <TableCell className="text-on-surface-variant">
                    {booking.guests ?? "—"}
                  </TableCell>
                  <TableCell className="text-on-surface-variant">
                    {formatPricingAmount(booking.amount, booking.currency)}
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
