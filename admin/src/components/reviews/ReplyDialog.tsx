import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ReplyDialogState } from "@/types/ui";
import { MAX_TEXT_LENGTH } from "@/constants/validation";

export function ReplyDialog({
  replyDialog,
  setReplyDialog,
  replyText,
  setReplyText,
  handleReply,
  isPending,
}: {
  replyDialog: ReplyDialogState;
  setReplyDialog: (opts: ReplyDialogState) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  handleReply: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog
      open={replyDialog.open}
      onOpenChange={(open) => setReplyDialog({ open })}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to Review</DialogTitle>
          <DialogDescription>
            Share your response to this customer's review.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="reply-text">Your Reply</Label>
            <textarea
              id="reply-text"
              placeholder="Thank you for your feedback..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              maxLength={MAX_TEXT_LENGTH}
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {replyText.length}/{MAX_TEXT_LENGTH}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setReplyDialog({ open: false });
              setReplyText("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReply}
            disabled={isPending || !replyText.trim()}
          >
            {isPending ? "Posting..." : "Post Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
