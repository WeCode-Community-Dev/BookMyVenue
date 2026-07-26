import { useState } from "react";
import { useParams } from "react-router";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useModal } from "@/hooks/useModal";

import {
  useOwnerBookings,
  useCreateOfflineBooking,
  useMarkBookingAsPaid,
  useCancelPendingOfflineBooking,
} from "@/services/api/useBookings";
import type { OfflineForm } from "@/types/ui";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { VENUE_STATUS } from "@/constants/venueStatus";

// Extracted Components
import { useOwnerBookingColumns } from "@/components/bookings/useOwnerBookingColumns";
import { OfflineBookingDialog } from "@/components/bookings/OfflineBookingDialog";

const EMPTY_FORM: OfflineForm = {
  customerName: "",
  customerPhone: "",
  date: "",
  startTime: "",
  endTime: "",
  amountPaid: "",
};

export default function OwnerBookingsPage() {
  const { venueId } = useParams<{ venueId: string }>();
  const { activeVenueStatus } = useAppStore();
  const isInactive = activeVenueStatus === VENUE_STATUS.INACTIVE;
  const [page, setPage] = useState(1);
  const [offlineOpen, setOfflineOpen] = useState(false);
  const [form, setForm] = useState<OfflineForm>(EMPTY_FORM);

  const { data, isLoading } = useOwnerBookings(venueId!, page);

  const offlineMutation = useCreateOfflineBooking();
  const { mutate: markAsPaid } = useMarkBookingAsPaid(venueId!);
  const { mutate: cancelPending } = useCancelPendingOfflineBooking(venueId!);
  const { success, error } = useToast();
  const { openModal } = useModal();

  const handleSubmit = () => {
    if (
      !form.customerName.trim() ||
      !form.customerPhone.trim() ||
      !form.date ||
      !form.startTime ||
      !form.endTime ||
      !form.amountPaid
    ) {
      error("Please fill in all fields");
      return;
    }
    const [sh, sm] = form.startTime.split(":").map(Number);
    const [eh, em] = form.endTime.split(":").map(Number);
    const startMins = (sh ?? 0) * 60 + (sm ?? 0);
    const endMins = (eh ?? 0) * 60 + (em ?? 0);
    if (endMins <= startMins) {
      error("End time must be after start time");
      return;
    }
    offlineMutation.mutate(
      {
        venueId: venueId!,
        customerName: form.customerName,
        phone: form.customerPhone,
        date: form.date,
        startTime: startMins,
        endTime: endMins,
        amountPaid: Number(form.amountPaid),
      },
      {
        onSuccess: () => {
          success("Offline booking created");
          setOfflineOpen(false);
          setForm(EMPTY_FORM);
        },
        onError: (e: unknown) => {
          const err = e as import("axios").AxiosError<{ message: string }>;
          error(err.response?.data?.message ?? "Failed to create booking");
        },
      },
    );
  };

  const columns = useOwnerBookingColumns({
    openModal,
    onMarkPaid: (id) => markAsPaid({ bookingId: id }),
    onCancelPending: (id) => cancelPending({ bookingId: id }),
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Bookings
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Manage your online and offline bookings
          </p>
        </div>
        <div className="relative group">
          <Button
            onClick={() => setOfflineOpen(true)}
            disabled={isInactive}
            className={cn(
              "bg-primary text-primary-foreground shadow-sm",
              isInactive
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary/90",
            )}
          >
            <Plus size={18} className="mr-2" />
            Add Offline Booking
          </Button>
          {isInactive && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Cannot create bookings while venue is inactive
            </div>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.bookings ?? []}
        page={page}
        totalPages={data?.pagination?.totalPages ?? 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No bookings found for this venue."
      />

      <OfflineBookingDialog
        offlineOpen={offlineOpen}
        setOfflineOpen={setOfflineOpen}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        isPending={offlineMutation.isPending}
        EMPTY_FORM={EMPTY_FORM}
      />
    </div>
  );
}
