import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type Props = {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  itemName?: string;
};

const Pagination = ({ pagination, onPageChange, itemName = 'item' }: Props) => {
  if (!pagination) return null;

  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs text-muted font-medium">
        Showing page <span className="font-bold text-foreground">{page}</span> of{' '}
        <span className="font-bold text-foreground">{totalPages}</span>{' '}
        <span className="hidden sm:inline">
          ({total} total {itemName}
          {total !== 1 ? 's' : ''})
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="
            inline-flex items-center justify-center gap-1.5
            rounded-lg border border-border bg-background
            px-3 py-2 text-xs font-semibold text-foreground
            hover:bg-surface transition-all
            disabled:opacity-40 disabled:cursor-not-allowed
            active:scale-95 cursor-pointer
          "
        >
          <ChevronLeft size={14} />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`
                  rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer
                  ${
                    page === pageNum
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted hover:text-foreground hover:bg-background'
                  }
                `}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="
            inline-flex items-center justify-center gap-1.5
            rounded-lg border border-border bg-background
            px-3 py-2 text-xs font-semibold text-foreground
            hover:bg-surface transition-all
            disabled:opacity-40 disabled:cursor-not-allowed
            active:scale-95 cursor-pointer
          "
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
