import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Modal } from '@venue404/ui'
import { Sparkles, Search, Info } from 'lucide-react'
import type { SearchResult } from '../../types'

type MatchDiagnostics = Pick<
  SearchResult,
  'match_source' | 'fts_score' | 'vector_score' | 'category_boost' | 'match_score'
>

const SOURCE_LABEL: Record<string, string> = {
  hybrid: 'Keyword + Semantic',
  semantic: 'Semantic match',
  keyword: 'Keyword match',
}

// fts_score (ts_rank) and match_score (weighted blend * category boost)
// aren't naturally bounded to [0, 1] the way cosine similarity is — ts_rank
// is a corpus-dependent, effectively open-ended scale, and boost can push
// the blended score above 1. Clamping to [0, 100]% trades a little
// precision on rare high-boost outliers for a number a non-technical user
// can actually read at a glance, which is the point of this modal.
function pct(value: number | null | undefined) {
  if (value == null) return '—'
  return `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`
}

export function MatchBadge({ venue }: { venue: MatchDiagnostics }) {
  const [open, setOpen] = useState(false)

  if (!venue.match_source) return null

  const label = SOURCE_LABEL[venue.match_source] ?? venue.match_source
  const Icon = venue.match_source === 'keyword' ? Search : Sparkles

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-brand/15 bg-brand/5 px-2.5 py-1 text-[11px] font-medium text-brand transition-colors hover:bg-brand/10"
      >
        <Icon className="h-3 w-3" />
        {label}
        <Info className="h-3 w-3 text-brand/60" />
      </button>

      {open &&
        createPortal(
          <Modal open={open} onClose={() => setOpen(false)} className="max-w-sm">
            <div className="border-b border-zinc-100 px-6 py-5">
              <h2 className="text-base font-semibold text-zinc-900">Why this venue matched</h2>
              <p className="mt-1 text-xs text-zinc-500">
                From our internal catalog — matched via {label.toLowerCase()}.
              </p>
            </div>

            <div className="space-y-3 p-6">
              <Row
                label="Semantic similarity"
                value={pct(venue.vector_score)}
                hint="How close your query's meaning is to this venue's listing"
              />
              <Row
                label="Keyword relevance"
                value={pct(venue.fts_score)}
                hint="Full-text match strength against the venue's name/description"
              />
              <Row
                label="Category boost"
                value={venue.category_boost != null ? `${venue.category_boost.toFixed(2)}x` : '—'}
                hint="Ranking bonus when your query's intent matches this venue's category"
              />
              <div className="mt-4 border-t border-zinc-100 pt-4">
                <Row
                  label="Overall match strength"
                  value={pct(venue.match_score)}
                  hint="Combines keyword relevance, semantic similarity, and category boost"
                  emphasize
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-zinc-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Close
              </button>
            </div>
          </Modal>,
          document.body
        )}
    </>
  )
}

function Row({
  label,
  value,
  hint,
  emphasize,
}: {
  label: string
  value: string
  hint: string
  emphasize?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={`text-sm ${emphasize ? 'font-semibold text-zinc-900' : 'text-zinc-700'}`}>
          {label}
        </p>
        <p className="mt-0.5 text-xs text-zinc-400">{hint}</p>
      </div>
      <p className={`shrink-0 text-sm ${emphasize ? 'font-bold text-brand' : 'font-medium text-zinc-900'}`}>
        {value}
      </p>
    </div>
  )
}
