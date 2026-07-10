import { ChevronLeft, ChevronRight } from "lucide-react";

const AdminPagination = ({
  page = 1,
  limit = 20,
  count = 0,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(count / limit));
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const start = count === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, count);

  if (count === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        Showing {start}–{end} of {count}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrev}
          className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </button>

        <span className="px-2 text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext}
          className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
