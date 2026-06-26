import { Pencil, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ReviewSectionCardProps = {
  title: string;
  icon: LucideIcon;
  accentClassName?: string;
  onEdit: () => void;
  children: React.ReactNode;
};

export function ReviewSectionCard({
  title,
  icon: Icon,
  accentClassName = "border-surface-tint",
  onEdit,
  children,
}: ReviewSectionCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg border border-outline-variant/40 bg-background",
        "border-l-4",
        accentClassName
      )}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-2">
          <Icon className="size-5 text-surface-tint" />
          <h2 className="text-base font-semibold text-on-surface">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-tint transition-opacity hover:opacity-80"
        >
          <Pencil className="size-3.5" />
          Edit
        </button>
      </div>
      <div className="border-t border-outline-variant/30 px-5 py-4">{children}</div>
    </section>
  );
}
