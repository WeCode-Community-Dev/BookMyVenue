import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateReview, venueReviewsKey } from "@/hooks/use-review";

const ReviewDialog = ({ venueId, venueName }: { venueId: string; venueName: string }) => {
  const queryClient = useQueryClient();
  const createReview = useCreateReview();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return toast.error("Please select a rating");
    if (!comment.trim()) return toast.error("Please write a comment");

    createReview.mutate(
      { venueId, rating, comment: comment.trim() },
      {
        onSuccess: () => {
          toast.success("Review submitted");
          queryClient.invalidateQueries({ queryKey: venueReviewsKey(venueId) });
          setOpen(false);
          setRating(0);
          setComment("");
        },
        onError: (error) =>
          toast.error(
            isAxiosError(error)
              ? (error.response?.data?.message ?? "Could not submit review")
              : "Could not submit review",
          ),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Write a review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {venueName}</DialogTitle>
          <DialogDescription>Share your experience with this venue.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setRating(i + 1)}>
                <StarIcon
                  className={cn(
                    "size-7 transition",
                    i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40",
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Tell others about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={createReview.isPending}>
            {createReview.isPending ? "Submitting..." : "Submit review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
