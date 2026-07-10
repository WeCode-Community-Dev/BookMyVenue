import type { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  subtitle?: string;
  stats?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
}

export default function SummaryCard({ title, subtitle, stats, actions, footer }: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 p-6 space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</h3>

        {subtitle && <p className="text-xs text-muted leading-snug">{subtitle}</p>}
      </div>

      {/* Stats */}
      {stats && <div className="flex flex-wrap gap-2">{stats}</div>}

      {/* Actions (cleaner admin bar) */}
      {actions && (
        <div className="pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        </div>
      )}

      {/* Footer */}
      {footer && <div className="pt-4 border-t border-border/60">{footer}</div>}
    </div>
  );
}
