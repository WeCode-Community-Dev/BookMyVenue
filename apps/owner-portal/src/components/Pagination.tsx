import React from 'react'

interface PaginationProps {
  page: number
  perPage: number
  total: number
  totalPages: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}

export function Pagination({ page, perPage, total, totalPages, setPage }: PaginationProps) {
  if (totalPages <= 1) return null

  const start = (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)

  return (
    <div className="flex items-center justify-between border-t border-zinc-200 dark:border-ink-700 px-6 py-4 bg-white dark:bg-ink-900 rounded-b-xl">
      <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
        {start}&ndash;{end} of {total}
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="px-4 py-1.5 border border-zinc-200 dark:border-ink-700 bg-white dark:bg-ink-900 hover:bg-zinc-50 dark:hover:bg-ink-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
          Page {page} of {totalPages}
        </span>
        
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="px-4 py-1.5 border border-zinc-200 dark:border-ink-700 bg-white dark:bg-ink-900 hover:bg-zinc-50 dark:hover:bg-ink-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
