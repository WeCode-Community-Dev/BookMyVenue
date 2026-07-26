import { useState } from "react";
import { useParams } from "react-router";
import { useToast } from "@/hooks/useToast";

import {
  useReviews,
  useReplyToReview,
  useReportReview,
} from "@/services/api/useReviews";
import type { ReplyDialogState, ReportDialogState } from "@/types/ui";
import { DataTable } from "@/components/ui/data-table";

// Extracted Components
import { useReviewColumns } from "@/components/reviews/useReviewColumns";
import { ReplyDialog } from "@/components/reviews/ReplyDialog";
import { ReportDialog } from "@/components/reviews/ReportDialog";

export default function ReviewsPage() {
  const { venueId } = useParams<{ venueId: string }>();
  const [page, setPage] = useState(1);

  const [replyDialog, setReplyDialog] = useState<ReplyDialogState>({
    open: false,
  });
  const [replyText, setReplyText] = useState("");

  const [reportDialog, setReportDialog] = useState<ReportDialogState>({
    open: false,
  });
  const [reportReason, setReportReason] = useState("");
  const [reportAction, setReportAction] = useState<"hide" | "flag">("hide");

  const { data, isLoading } = useReviews(venueId!, page);

  const replyMutation = useReplyToReview();
  const reportMutation = useReportReview();
  const { success, error } = useToast();

  const handleReply = () => {
    if (!replyText.trim()) return error("Please enter a reply");
    if (!replyDialog.reviewId) return;

    replyMutation.mutate(
      { venueId: venueId!, reviewId: replyDialog.reviewId, text: replyText },
      {
        onSuccess: () => {
          success("Reply submitted");
          setReplyDialog({ open: false });
          setReplyText("");
        },
        onError: (e: unknown) => {
          const err = e as import("axios").AxiosError<{ message: string }>;
          error(err.response?.data?.message ?? "Failed to submit reply");
        },
      },
    );
  };

  const handleReport = () => {
    if (!reportReason.trim()) return error("Please enter a report reason");
    if (!reportDialog.reviewId) return;

    reportMutation.mutate(
      {
        venueId: venueId!,
        reviewId: reportDialog.reviewId,
        reason: reportReason,
        action: reportAction,
      },
      {
        onSuccess: () => {
          success("Review reported successfully");
          setReportDialog({ open: false });
          setReportReason("");
          setReportAction("hide");
        },
        onError: (e: unknown) => {
          const err = e as import("axios").AxiosError<{ message: string }>;
          error(err.response?.data?.message ?? "Failed to report review");
        },
      },
    );
  };

  const columns = useReviewColumns({
    setReplyDialog,
    setReplyText,
    replyPending: replyMutation.isPending,
    setReportDialog,
    setReportReason,
    reportPending: reportMutation.isPending,
  });

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-1">
          All reviews left on your venue. Reply to reviews and report
          inappropriate content to admins.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data?.reviews ?? []}
        page={page}
        totalPages={data?.pagination?.totalPages ?? 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No reviews yet for this venue."
      />

      <ReplyDialog
        replyDialog={replyDialog}
        setReplyDialog={setReplyDialog}
        replyText={replyText}
        setReplyText={setReplyText}
        handleReply={handleReply}
        isPending={replyMutation.isPending}
      />

      <ReportDialog
        reportDialog={reportDialog}
        setReportDialog={setReportDialog}
        reportReason={reportReason}
        setReportReason={setReportReason}
        reportAction={reportAction}
        setReportAction={setReportAction}
        handleReport={handleReport}
        isPending={reportMutation.isPending}
      />
    </div>
  );
}
