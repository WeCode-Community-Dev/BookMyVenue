"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type CreateSpaceFormActionsProps = {
  venueId: string;
  isSubmitting: boolean;
  onSaveDraft: () => void;
  onCreateSpace: () => void;
};

export function CreateSpaceFormActions({
  venueId,
  isSubmitting,
  onSaveDraft,
  onCreateSpace,
}: CreateSpaceFormActionsProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-6 border-t border-outline-variant/40 bg-surface px-6 py-4 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          className="h-10 text-on-surface-variant"
          asChild
        >
          <Link href={`/my-venues/${venueId}`}>Cancel</Link>
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={onSaveDraft}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
          <Button
            type="button"
            className="h-10 gap-2"
            onClick={onCreateSpace}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Space
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
