import { Lightbulb } from "lucide-react";

import { listVenueProTip } from "@/lib/data/list-venue";

type ListVenueProTipProps = {
  title?: string;
  body?: string;
};

export function ListVenueProTip({
  title = listVenueProTip.title,
  body = listVenueProTip.body,
}: ListVenueProTipProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-primary-container bg-primary-container/40 p-4">
      <Lightbulb className="size-5 shrink-0 text-surface-tint" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-on-surface">{title}</p>
        <p className="text-sm text-on-surface-variant">{body}</p>
      </div>
    </div>
  );
}
