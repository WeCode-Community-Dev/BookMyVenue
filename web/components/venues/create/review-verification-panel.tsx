import { ShieldCheck } from "lucide-react";

import { reviewVerificationCopy } from "@/lib/data/list-venue";

export function ReviewVerificationPanel() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-outline-variant/40 bg-background p-5">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-5 text-surface-tint" />
        <h2 className="text-base font-semibold text-on-surface">
          {reviewVerificationCopy.title}
        </h2>
      </div>
      <p className="text-sm text-on-surface-variant">
        {reviewVerificationCopy.body}
      </p>
    </div>
  );
}
