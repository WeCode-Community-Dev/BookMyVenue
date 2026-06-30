import { Badge } from "@/components/ui/Card";
import type { BookingStatus, VenueStatus } from "@/lib/types";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, { color: "gray" | "green" | "yellow" | "red"; label: string }> = {
    pending: { color: "yellow", label: "Pending" },
    confirmed: { color: "green", label: "Confirmed" },
    declined: { color: "red", label: "Declined" },
    cancelled: { color: "gray", label: "Cancelled" },
    completed: { color: "green", label: "Completed" },
  };
  const { color, label } = map[status];
  return <Badge color={color}>{label}</Badge>;
}

export function VenueStatusBadge({ status }: { status: VenueStatus }) {
  const map: Record<VenueStatus, { color: "gray" | "green" | "yellow" | "red"; label: string }> = {
    pending: { color: "yellow", label: "Pending" },
    approved: { color: "green", label: "Approved" },
    rejected: { color: "red", label: "Rejected" },
  };
  const { color, label } = map[status];
  return <Badge color={color}>{label}</Badge>;
}
