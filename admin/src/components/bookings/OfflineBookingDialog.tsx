import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { OfflineForm } from "@/types/ui";

export function OfflineBookingDialog({
  offlineOpen,
  setOfflineOpen,
  form,
  setForm,
  handleSubmit,
  isPending,
  EMPTY_FORM,
}: {
  offlineOpen: boolean;
  setOfflineOpen: (open: boolean) => void;
  form: OfflineForm;
  setForm: React.Dispatch<React.SetStateAction<OfflineForm>>;
  handleSubmit: () => void;
  isPending: boolean;
  EMPTY_FORM: OfflineForm;
}) {
  const set =
    (field: keyof OfflineForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Dialog open={offlineOpen} onOpenChange={setOfflineOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Offline Booking</DialogTitle>
          <DialogDescription>
            Record a cash or walk-in booking directly without an online payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <Label htmlFor="ob-name">Customer Name *</Label>
              <Input
                id="ob-name"
                placeholder="Ravi Kumar"
                value={form.customerName}
                onChange={set("customerName")}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label htmlFor="ob-phone">Phone *</Label>
              <Input
                id="ob-phone"
                placeholder="+91 98765 43210"
                value={form.customerPhone}
                onChange={set("customerPhone")}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label htmlFor="ob-date">Date *</Label>
              <Input
                id="ob-date"
                type="date"
                value={form.date}
                onChange={set("date")}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ob-start">Start Time *</Label>
              <Input
                id="ob-start"
                type="time"
                value={form.startTime}
                onChange={set("startTime")}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ob-end">End Time *</Label>
              <Input
                id="ob-end"
                type="time"
                value={form.endTime}
                onChange={set("endTime")}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label htmlFor="ob-amount">Amount Paid (₹) *</Label>
              <Input
                id="ob-amount"
                type="number"
                placeholder="5000"
                min={1}
                value={form.amountPaid}
                onChange={set("amountPaid")}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOfflineOpen(false);
              setForm(EMPTY_FORM);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving…" : "Create Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
