import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/store";
import {
  useCreateReview,
  useDeleteReview,
  useUpdateReview,
  useVenueReviews,
  venueReviewsKey,
} from "@/hooks/use-review";

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const Stars = ({ value }: { value: number }) => (
  <div className="flex">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={cn(
          "size-4",
          i < value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40",
        )}
      />
    ))}
  </div>
);

const errorMessage = (error: unknown, fallback: string) =>
  isAxiosError(error) ? (error.response?.data?.message ?? fallback) : fallback;

const VenueReviews = ({ venueId }: { venueId: string }) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { data: reviews, isLoading } = useVenueReviews(venueId);

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const myReview = reviews?.find((review) => review.customer?._id === user?._id);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment);
    }
  }, [myReview?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: venueReviewsKey(venueId) });

  const handleSubmit = () => {
    if (rating === 0) return toast.error("Please select a rating");
    if (!comment.trim()) return toast.error("Please write a comment");

    if (myReview) {
      updateReview.mutate(
        { reviewId: myReview._id, rating, comment: comment.trim() },
        {
          onSuccess: () => {
            toast.success("Review updated");
            invalidate();
          },
          onError: (error) => toast.error(errorMessage(error, "Could not update review")),
        },
      );
    } else {
      createReview.mutate(
        { venueId, rating, comment: comment.trim() },
        {
          onSuccess: () => {
            toast.success("Review submitted");
            invalidate();
          },
          onError: (error) => toast.error(errorMessage(error, "Could not submit review")),
        },
      );
    }
  };

  const handleDelete = () => {
    if (!myReview) return;
    deleteReview.mutate(myReview._id, {
      onSuccess: () => {
        toast.success("Review deleted");
        setRating(0);
        setComment("");
        invalidate();
      },
      onError: (error) => toast.error(errorMessage(error, "Could not delete review")),
    });
  };

  const otherReviews = reviews?.filter((review) => review.customer?._id !== user?._id) ?? [];
  const isSaving = createReview.isPending || updateReview.isPending;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Reviews</h2>

      {user?.role === "CUSTOMER" && (
        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <p className="text-sm font-medium">{myReview ? "Your review" : "Write a review"}</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setRating(i + 1)}>
                <StarIcon
                  className={cn(
                    "size-6 transition",
                    i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40",
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "Saving..." : myReview ? "Update review" : "Submit review"}
            </Button>
            {myReview && (
              <Button variant="outline" onClick={handleDelete} disabled={deleteReview.isPending}>
                Delete
              </Button>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : otherReviews.length === 0 && !myReview ? (
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {otherReviews.map((review) => (
            <div key={review._id} className="flex flex-col gap-1 border-b pb-4 last:border-b-0">
              <div className="flex items-center justify-between">
                <span className="font-medium">{review.customer?.name ?? "Customer"}</span>
                <span className="text-xs text-muted-foreground">
                  {dateFmt.format(new Date(review.createdAt))}
                </span>
              </div>
              <Stars value={review.rating} />
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueReviews;
