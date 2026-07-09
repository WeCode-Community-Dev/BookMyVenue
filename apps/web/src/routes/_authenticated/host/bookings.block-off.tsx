import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { listHostVenues } from "@/server-adapters/venues.functions";
import { createBlockOff } from "@/server-adapters/bookings.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/host/bookings/block-off")({
  head: () => ({ meta: [{ title: "Block off time — Book My Venue" }] }),
  component: BlockOffPage,
});

function BlockOffPage() {
  const navigate = useNavigate();
  const listVenuesFn = useServerFn(listHostVenues);
  const createFn = useServerFn(createBlockOff);

  const { data: venues = [] } = useQuery({
    queryKey: ["host-venues"],
    queryFn: () => listVenuesFn({}),
  });

  const [venueId, setVenueId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!venueId) return toast.error("Pick a venue");
    setLoading(true);
    try {
      await createFn({
        data: {
          venue_id: venueId,
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
          notes: notes || undefined,
        },
      });
      toast.success("Time blocked off");
      navigate({ to: "/host/bookings" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to block off");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/host/bookings" className="text-xs text-brand font-medium">
        ← Back to bookings
      </Link>
      <h2 className="font-serif text-3xl mt-2 mb-2">Block off time</h2>
      <p className="text-sm text-lead/60 mb-6">
        Mark a slot as unavailable for maintenance, private use, or holidays. Customers won't be
        able to book this time.
      </p>

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

        <div>
          <Label htmlFor="notes">Reason (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. Maintenance, private event"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-lead text-surface hover:bg-lead/90"
        >
          {loading ? "Blocking…" : "Block off slot"}
        </Button>
      </form>
    </div>
  );
}
