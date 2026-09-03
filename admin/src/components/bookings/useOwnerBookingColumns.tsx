import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Booking } from "@/types/models";
import { STATUS_VARIANT } from "@/constants/statusVariants";
import { minutesToTime } from "@/utils/bookingUtils";
import { type ActiveModal } from "@/store/useModalStore";
import { BookingDetailPanel } from "@/components/common/panels/BookingDetailPanel";

export function useOwnerBookingColumns({
  openModal,
  onMarkPaid,
  onCancelPending,
}: {
  openModal: (opts: Omit<ActiveModal, "id">) => void;
  onMarkPaid?: (bookingId: string) => void;
  onCancelPending?: (bookingId: string) => void;
}): ColumnDef<Booking, unknown>[] {
  return [
    {
      accessorKey: "_id",
      header: "Booking ID",
      cell: ({ row }) => {
        const id: string = row.original._id;
        return (
          <span
            className="font-mono text-sm font-medium cursor-pointer text-primary hover:underline"
            onClick={() =>
              openModal({
                title: `Booking Details`,
                size: "xl",
                component: BookingDetailPanel,
                data: { ...row.original, userRole: "owner" },
                actions: [],
              })
            }
          >
            <span className="inline-flex items-center gap-1">
              BMV-{id.slice(-6).toUpperCase()}
              {row.original.paymentMethod === "offline" && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                  Offline
                </span>
              )}
            </span>
          </span>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.date}</p>
          <p className="text-xs text-muted-foreground">
            {minutesToTime(row.original.startTime)} —{" "}
            {minutesToTime(row.original.endTime)}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "bookerName",
      header: "Customer",
      cell: ({ row }) => (
        <div
          className="cursor-pointer hover:text-primary"
          onClick={() =>
            openModal({
              title: `Booking Details`,
              size: "xl",
              component: BookingDetailPanel,
              data: { ...row.original, userRole: "owner" },
              actions: [],
            })
          }
        >
          <p className="font-medium">{row.original.bookerName ?? "—"}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.bookerPhone ?? ""}
          </p>
          {row.original.bookerEmail && (
            <p className="text-xs text-muted-foreground">
              {row.original.bookerEmail}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "totalPrice",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-semibold text-emerald-600">
          ₹{(row.original.price as number)?.toLocaleString("en-IN") ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize text-xs">
          {(row.original.paymentMethod as string) ?? "online"}
        </Badge>
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => (
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const displayStatus = row.original.uiStatus ?? row.original.status;
        return (
          <Badge
            variant={
              STATUS_VARIANT[(displayStatus as string).toUpperCase()] ??
              "outline"
            }
          >
            {(displayStatus as string).toUpperCase()}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const paymentStatus = row.original.paymentStatus as string;
        if (paymentStatus === "pending") {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => onMarkPaid?.(row.original._id)}
                className="text-xs text-green-600 hover:underline"
              >
                Mark Paid
              </button>
              <button
                onClick={() => onCancelPending?.(row.original._id)}
                className="text-xs text-red-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          );
        }
        return null;
      },
    },
  ];
}
