import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BOOKING_STATUS_COLORS } from "@/constants/bookings";
import { STATUS_VARIANT } from "@/constants/statusVariants";
import { minutesToTime } from "@/utils/bookingUtils";
import { cn } from "@/lib/utils";
import {
  Clock,
  Calendar as CalendarIcon,
  MapPin,
  IndianRupee,
  User,
  FileText,
} from "lucide-react";

interface BookingData {
  status: string;
  duration?: number;
  venueId?: string;
  date?: string;
  startTime?: number;
  endTime?: number;
  amountPaid?: number;
  platformFee?: number;
  taxAmount?: number;
  contactNumber?: string;
  customerName?: string;
  guests?: number;
  paymentReference?: string;
  createdAt?: string;
  _id?: string;
  cancellationReason?: string;
  eventType?: string;
  price?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  userId?: string;
  user?: { _id?: string; username?: string; email?: string; phone?: string };
  bookerName?: string;
  bookerEmail?: string;
  bookerPhone?: string;
  bookerInfo?: { name?: string; email?: string; phone?: string };
  venue?: { _id?: string; name?: string; city?: string; address?: string };
  [key: string]: unknown;
}
export function BookingDetailPanel({
  data: rawData,
}: {
  data: Record<string, unknown>;
}) {
  const userRole = (rawData as Record<string, unknown>).userRole as
    | string
    | undefined;
  const isOwner = userRole === "owner";
  const data = rawData as unknown as BookingData;
  if (!data) return null;

  const statusColor =
    BOOKING_STATUS_COLORS[data.status as keyof typeof BOOKING_STATUS_COLORS] ??
    "bg-gray-500/10 text-gray-500";

  return (
    <div className="space-y-6 text-sm">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl bg-background/50 border border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            Booking{" "}
            <span className="font-mono text-muted-foreground text-base">
              #{data._id?.slice(-6).toUpperCase()}
            </span>
          </h2>
          <div className="text-muted-foreground mt-1 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {data.createdAt ? new Date(data.createdAt).toLocaleString() : "N/A"}
          </div>
        </div>
        <Badge
          className={`${statusColor} border-none px-3 py-1 text-sm font-medium`}
        >
          {data.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Booking Schedule */}
        <Card className="p-5 space-y-4 bg-background/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
            <Clock className="w-4 h-4 text-primary" /> Schedule & Timing
          </h3>
          <div className="grid grid-cols-2 gap-y-3">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Date
              </span>
              <span className="font-medium text-foreground">
                {data.date ? new Date(data.date).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Time Slots
              </span>
              <span className="font-medium text-foreground">
                {data.startTime !== undefined && data.endTime !== undefined
                  ? `${minutesToTime(data.startTime)} - ${minutesToTime(data.endTime)}`
                  : "N/A"}
              </span>
            </div>
            {data.eventType && (
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                  Type
                </span>
                <span className="font-medium text-foreground capitalize">
                  {data.eventType}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Info */}
        <Card className="p-5 space-y-4 bg-background/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
            <IndianRupee className="w-4 h-4 text-primary" /> Payment Details
          </h3>
          <div className="grid grid-cols-2 gap-y-3">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Total Amount
              </span>
              <span className="text-lg font-bold text-green-500">
                ₹{data.price}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Method
              </span>
              <span className="font-medium text-foreground uppercase tracking-wide">
                {data.paymentMethod || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Payment Status
              </span>
              <Badge
                variant={
                  STATUS_VARIANT[
                    (data.paymentStatus as string)?.toUpperCase()
                  ] ?? "outline"
                }
                className={cn(
                  data.paymentStatus === "paid" &&
                    "text-green-500 border-green-500/30",
                )}
              >
                {(data.paymentStatus as string)?.toUpperCase() || "—"}
              </Badge>
            </div>
            {data.paymentReference && (
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                  Transaction ID
                </span>
                <span className="font-mono text-xs text-foreground bg-accent/50 px-2 py-1 rounded">
                  {data.paymentReference}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Venue Info */}
        <Card className="p-5 space-y-4 bg-background/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
            <MapPin className="w-4 h-4 text-primary" /> Venue Information
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Venue Name
              </span>
              <span className="font-medium text-foreground">
                {data.venue?.name || "N/A"}
              </span>
            </div>
            {(data.venue?.city || data.venue?.address) && (
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                  Location
                </span>
                <span className="text-foreground">
                  {data.venue?.address}, {data.venue?.city}
                </span>
              </div>
            )}
            {!isOwner && (
              <div className="text-xs">
                <span className="text-muted-foreground block uppercase tracking-wider mb-1">
                  Venue ID
                </span>
                <span className="font-mono bg-accent/50 px-2 py-1 rounded">
                  {data.venue?.name
                    ? `${data.venue.name} — ${data.venue?._id || data.venueId}`
                    : data.venue?._id || data.venueId}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Booker Info */}
        <Card className="p-5 space-y-4 bg-background/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
            <User className="w-4 h-4 text-primary" /> Customer Details
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                Customer Name
              </span>
              <span className="font-medium text-foreground">
                {(data.bookerName as string) || data.bookerInfo?.name || "N/A"}
              </span>
            </div>
            {((data.bookerEmail as string) ||
              (data.bookerPhone as string) ||
              data.bookerInfo?.email ||
              data.bookerInfo?.phone) && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                    Email
                  </span>
                  <span className="text-foreground">
                    {(data.bookerEmail as string) ||
                      data.bookerInfo?.email ||
                      "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                    Phone
                  </span>
                  <span className="text-foreground">
                    {(data.bookerPhone as string) ||
                      data.bookerInfo?.phone ||
                      "N/A"}
                  </span>
                </div>
              </div>
            )}
            {isOwner && data.user && (
              <div className="text-xs text-muted-foreground">
                Booked by{" "}
                <span className="font-medium text-foreground">
                  {(data.user as Record<string, unknown>)?.username as string}
                </span>
              </div>
            )}
            {!isOwner && (
              <div className="text-xs">
                <span className="text-muted-foreground block uppercase tracking-wider mb-1">
                  User ID
                </span>
                <span className="font-mono bg-accent/50 px-2 py-1 rounded">
                  {data.user
                    ? `${(data.user as Record<string, unknown>).username as string} (${(data.user as Record<string, unknown>).email as string}) — ${data.userId}`
                    : data.userId}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Cancellation / Refund Info */}
      {(data.status === "CANCELLED" || data.status === "REFUNDED") && (
        <Card className="p-5 space-y-4 bg-red-500/5 border-red-500/20">
          <h3 className="font-semibold text-red-400 flex items-center gap-2 border-b border-red-500/20 pb-2">
            <FileText className="w-4 h-4" /> Cancellation & Refund
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.cancellationReason && (
              <div>
                <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                  Reason
                </span>
                <span className="text-foreground">
                  {data.cancellationReason}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
