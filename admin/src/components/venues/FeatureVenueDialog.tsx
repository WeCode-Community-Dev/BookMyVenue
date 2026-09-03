import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FEATURE_DURATION_OPTIONS } from "@/constants/bookings";

export function FeatureVenueDialog({
  open,
  setOpen,
  featureDuration,
  setFeatureDuration,
  handleFeature,
  isPending,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  featureDuration: string;
  setFeatureDuration: (duration: string) => void;
  handleFeature: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feature Venue</DialogTitle>
          <DialogDescription>
            Choose how long this venue appears in the featured section.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="feature-duration">Duration</Label>
          <Select value={featureDuration} onValueChange={setFeatureDuration}>
            <SelectTrigger id="feature-duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FEATURE_DURATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={isPending} onClick={handleFeature}>
            {isPending ? "Saving…" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
