import { Badge } from "@/components/ui/badge";
import { BookingDetailPanel } from "@/components/common/panels/BookingDetailPanel";
import { STATUS_VARIANT } from "@/constants/statusVariants";
import { VenueDetailPanel } from "@/components/common/panels/VenueDetailPanel";
import { UserDetailPanel } from "@/components/common/panels/UserDetailPanel";
import { useApiQuery } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { PROFILE_STALE_TIME } from "@/constants/queryConfig";
import { ROLES } from "@/constants/roles";

import type { Booking } from "@/types/models";
import type { UserProfile } from "@/components/guards/AuthGuard";

import { type ActiveModal } from "@/store/useModalStore";

export function useBookingColumns({
  openModal,
}: {
  openModal: (opts: Omit<ActiveModal, "id">) => void;
}) {
  const { data: profile } = useApiQuery<UserProfile>(
    QUERY_KEYS.PROFILE,
    { method: "GET", url: API_ENDPOINTS.PROFILE },
    { staleTime: PROFILE_STALE_TIME },
  );

  const isAdmin =
    profile?.role === ROLES.ADMIN || profile?.role === ROLES.SUPER_ADMIN;

  const getDisplayStatus = (booking: Booking) => booking.uiStatus;

  const getStatusVariant = (status: string) => {
    const statusKey = status.toUpperCase();
    return STATUS_VARIANT[statusKey] ?? "outline";
  };

  return [
    {
      accessorKey: "_id",
      header: "Booking ID",
      cell: ({ row }: { row: { original: Booking } }) => {
        const id: string = row.original._id;
        return (
          <span
            className="font-mono text-sm font-medium cursor-pointer text-primary hover:underline"
            onClick={() => {
              openModal({
                title: `Booking Details`,
                size: "xl",
                component: BookingDetailPanel,
                data: { ...row.original, userRole: "admin" },
                actions: [],
              });
            }}
          >
            BMV-{id.slice(-6).toUpperCase()}
          </span>
        );
      },
    },
    {
      accessorKey: "venueId",
      header: "Venue",
      cell: ({ row }: { row: { original: Booking } }) => (
        <span
          className="font-medium cursor-pointer text-primary hover:underline"
          onClick={() => {
            if (row.original.venue?._id) {
              openModal({
                title: `Venue Details`,
                size: "xl",
                component: VenueDetailPanel,
                data: row.original.venue,
                actions: [],
              });
            }
          }}
        >
          {row.original.venue?.name ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "userId",
      header: "User Account",
      headerClassName: isAdmin ? "" : "hidden",
      cell: ({ row }: { row: { original: Booking } }) => {
        if (!isAdmin) return <span className="hidden" />;
        const user = row.original.user;
        if (!user) return <span className="text-muted-foreground">—</span>;
        return (
          <span
            className="font-medium cursor-pointer text-primary hover:underline"
            onClick={() => {
              openModal({
                title: `User Details`,
                size: "lg",
                component: UserDetailPanel,
                data: user,
                actions: [],
              });
            }}
          >
            {user.username} ({user.email})
          </span>
        );
      },
    },
    {
      accessorKey: "bookerName",
      header: "Booked By",
      cell: ({ row }: { row: { original: Booking } }) => {
        return (
          <div>
            <p className="font-medium text-sm">
              {row.original.bookerName ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.original.bookerPhone ?? "—"}
            </p>
            {row.original.bookerEmail && (
              <p className="text-xs text-muted-foreground">
                {row.original.bookerEmail}
              </p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Event Date",
      cell: ({ row }: { row: { original: Booking } }) =>
        new Date(row.original.date).toLocaleDateString(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: Booking } }) => {
        const displayStatus = getDisplayStatus(row.original) ?? "confirmed";
        return (
          <Badge variant={getStatusVariant(displayStatus)}>
            {displayStatus.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Amount",
      cell: ({ row }: { row: { original: Booking } }) => (
        <span className="font-semibold text-green-600">
          ₹
          {row.original.price != null
            ? (row.original.price as number).toLocaleString("en-IN")
            : "0"}
        </span>
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }: { row: { original: Booking } }) => (
        <Badge
          variant={
            STATUS_VARIANT[
              (row.original.paymentStatus as string)?.toUpperCase()
            ] ?? "outline"
          }
        >
          {(row.original.paymentStatus as string)?.toUpperCase() || "—"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Booked On",
      cell: ({ row }: { row: { original: Booking } }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
  ];
}
