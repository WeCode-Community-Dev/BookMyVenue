import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import type { RejectionEntry } from '@/types/venue.types';

interface RejectionHistoryAccordionProps {
  rejectionHistory: RejectionEntry[];
}

export function RejectionHistoryAccordion({ rejectionHistory }: RejectionHistoryAccordionProps) {
  if (!rejectionHistory?.length) return null;

  return (
    <div className="mt-4 border-t border-[var(--bg-grey)] pt-4">
      <details className="group">
        <summary className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-[var(--bg-grey)]/50 transition-colors list-none">
          <span className="font-medium text-[var(--text-primary)]">
            Rejection History ({rejectionHistory.length}/10)
          </span>
          <ChevronDown
            className="text-[var(--text-secondary)] transition-transform group-open:rotate-180"
            size={16}
          />
        </summary>

        <div className="mt-3 space-y-3 pl-4 border-l-2 border-[var(--bg-grey)]">
          {rejectionHistory
            .slice()
            .reverse()
            .map((entry, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--bg-grey)]"
              >
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
                  <span>Attempt #{entry.submissionNumber}</span>
                  <span>Deadline: {format(new Date(entry.editDeadline), 'PPp')}</span>
                </div>
                {entry.extendedAt && (
                  <p className="text-xs text-[var(--text-secondary)] mb-1">
                    Extended on {format(new Date(entry.extendedAt), 'PPp')}
                  </p>
                )}
                <p className="text-sm text-[var(--text-primary)]">{entry.reason}</p>
              </div>
            ))}
        </div>
      </details>
    </div>
  );
}
