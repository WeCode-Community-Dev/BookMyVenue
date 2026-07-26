import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types";
import type { ReplyDialogState, ReportDialogState } from "@/types/ui";
import {
  STATUS_VARIANT,
  HIDE_REQUEST_VARIANT,
} from "@/constants/statusVariants";

export function useReviewColumns({
  setReplyDialog,
  setReplyText,
  replyPending,
  setReportDialog,
  setReportReason,
  reportPending,
}: {
  setReplyDialog: (opts: ReplyDialogState) => void;
  setReplyText: (text: string) => void;
  replyPending: boolean;

  setReportDialog: (opts: ReportDialogState) => void;
  setReportReason: (reason: string) => void;
  reportPending: boolean;
}): ColumnDef<Review, unknown>[] {
  return [
    {
      accessorKey: "userId",
      header: "Reviewer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm">{row.original.userId.username}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.userId.email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={
                i < row.original.rating ? "text-yellow-500" : "text-gray-300"
              }
            >
              ★
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => (
        <p className="text-sm max-w-xs truncate">
          {row.original.comment || "—"}
        </p>
      ),
    },
    {
      accessorKey: "ownerReply",
      header: "Your Reply",
      cell: ({ row }) =>
        row.original.ownerReply ? (
          <div className="text-sm">
            <p className="text-gray-600 dark:text-gray-400 italic">
              {row.original.ownerReply.text}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(row.original.ownerReply.repliedAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setReplyDialog({ open: true, reviewId: row.original._id });
              setReplyText("");
            }}
            disabled={replyPending}
          >
            Reply
          </Button>
        ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex flex-col gap-2">
          <Badge variant={STATUS_VARIANT[row.original.status] ?? "outline"}>
            {row.original.status}
          </Badge>
          {row.original.hideRequestStatus !== "none" && (
            <Badge
              variant={HIDE_REQUEST_VARIANT[row.original.hideRequestStatus]}
            >
              {row.original.hideRequestStatus === "pending"
                ? "Hide Requested"
                : `Hide ${row.original.hideRequestStatus}`}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            setReportDialog({ open: true, reviewId: row.original._id });
            setReportReason("");
          }}
          disabled={
            row.original.hideRequestStatus === "pending" || reportPending
          }
        >
          Report
        </Button>
      ),
    },
  ];
}
