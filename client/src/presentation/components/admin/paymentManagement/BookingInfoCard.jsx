import {
  CalendarDays,
  Clock3,
  ClipboardList,
  CreditCard,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const BookingInfoCard = ({ booking }) => {
  if (!booking) return null;

  const bookingStatusClass = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
  };

  const paymentStatusClass = {
    pending: "bg-yellow-100 text-yellow-700",
    partial: "bg-orange-100 text-orange-700",
    paid: "bg-green-100 text-green-700",
    refunded: "bg-purple-100 text-purple-700",
    failed: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">

        {/* Booking ID */}
        <div className="flex items-start gap-3">
          <ClipboardList className="w-5 h-5 text-primary mt-1" />

          <div>
            <p className="text-sm text-muted-foreground">
              Booking ID
            </p>

            <p className="font-medium">
              {booking.id?.slice(-8)}
            </p>
          </div>
        </div>

        {/* Booking Date */}
        <div className="flex items-start gap-3">
          <CalendarDays className="w-5 h-5 text-primary mt-1" />

          <div>
            <p className="text-sm text-muted-foreground">
              Booking Date
            </p>

            <p className="font-medium">
              {new Date(
                booking.bookingDate
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Event Time */}
        <div className="flex items-start gap-3">
          <Clock3 className="w-5 h-5 text-primary mt-1" />

          <div>
            <p className="text-sm text-muted-foreground">
              Event Time
            </p>

            <p className="font-medium">
              {booking.startTime} - {booking.endTime}
            </p>
          </div>
        </div>

        {/* Booking Status */}
        <div className="flex items-start gap-3">
          <ClipboardList className="w-5 h-5 text-primary mt-1" />

          <div>
            <p className="text-sm text-muted-foreground">
              Booking Status
            </p>

            <Badge
              className={
                bookingStatusClass[booking.status]
              }
            >
              {booking.status}
            </Badge>
          </div>
        </div>

        {/* Booking Payment Status */}
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-primary mt-1" />

          <div>
            <p className="text-sm text-muted-foreground">
              Booking Payment Status
            </p>

            <Badge
              className={
                paymentStatusClass[
                  booking.paymentStatus
                ]
              }
            >
              {booking.paymentStatus}
            </Badge>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default BookingInfoCard;