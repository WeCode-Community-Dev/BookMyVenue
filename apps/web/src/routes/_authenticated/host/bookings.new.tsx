import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { listHostVenues } from "@/server-adapters/venues.functions";
import { createOfflineBooking } from "@/server-adapters/bookings.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/host/bookings/new")({
  head: () => ({ meta: [{ title: "New offline booking — Book My Venue" }] }),
  component: NewOfflineBookingPage,
});

function NewOfflineBookingPage() {
  const navigate = useNavigate();
  const listVenuesFn = useServerFn(listHostVenues);
  const createFn = useServerFn(createOfflineBooking);

  const { data: venues = [] } = useQuery({
    queryKey: ["host-venues"],
    queryFn: () => listVenuesFn({}),
  });

  const [venueId, setVenueId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestCount, setGuestCount] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "bank_transfer" | "card_offline" | "online" | "other"
  >("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!venueId) return toast.error("Pick a venue");
    setLoading(true);
    try {
      const total = Math.round(parseFloat(totalAmount || "0") * 100);
      const paid = Math.round(parseFloat(amountPaid || "0") * 100);
      await createFn({
        data: {
          venue_id: venueId,
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
          guest_name: guestName,
          guest_email: guestEmail || undefined,
          guest_phone: guestPhone || undefined,
          guest_count: guestCount ? parseInt(guestCount, 10) : undefined,
          total_cents: total,
          payment_method: paymentMethod,
          amount_paid_cents: paid,
          notes: notes || undefined,
        },
      });
      toast.success("Offline booking created");
      navigate({ to: "/host/bookings" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/host/bookings" className="text-xs text-brand font-medium">
        ← Back to bookings
      </Link>
      <h2 className="font-serif text-3xl mt-2 mb-6">New offline booking</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white ring-1 ring-black/5 rounded-2xl p-6 space-y-5"
      >
        <div>
          <Label htmlFor="venue">Venue</Label>
          <select
            id="venue"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            className="w-full mt-1 ring-1 ring-black/10 rounded-md px-3 py-2 text-sm bg-white"
            required
          >
            <option value="">Select a venue…</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start">Start</Label>
            <Input
              id="start"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="end">End</Label>
            <Input
              id="end"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="pt-2 border-t border-black/5">
          <p className="text-[11px] uppercase tracking-widest text-lead/40 font-bold mb-3">
            Customer
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="count">Guests (optional)</Label>
              <Input
                id="count"
                type="number"
                min="1"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-black/5">
          <p className="text-[11px] uppercase tracking-widest text-lead/40 font-bold mb-3">
            Payment
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total">Total amount</Label>
              <Input
                id="total"
                type="number"
                step="0.01"
                min="0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="paid">Amount paid</Label>
              <Input
                id="paid"
                type="number"
                step="0.01"
                min="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="method">Payment method</Label>
            <select
              id="method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
              className="w-full mt-1 ring-1 ring-black/10 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank transfer</option>
              <option value="card_offline">Card (offline)</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {loading ? "Saving…" : "Create booking"}
        </Button>
      </form>
    </div>
  );
}
