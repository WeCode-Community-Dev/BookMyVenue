import { useEffect, useState } from 'react'
import type { VenuePhoto } from '../../types'

type Props = {
  photos: VenuePhoto[]
  venueName: string
}

// ─── No-photo placeholder ─────────────────────────────────────────────────────

function GalleryPlaceholder() {
  return (
    <div className="w-full h-[420px] sm:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-50 flex flex-col items-center justify-center gap-4 dark:from-zinc-800 dark:to-zinc-900">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-ink-800">
        <svg className="h-9 w-9 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-zinc-400">No photos available</p>
      <p className="text-xs text-zinc-300">The venue owner hasn't uploaded photos yet</p>
    </div>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  photos,
  active,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: {
  photos: VenuePhoto[]
  active: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onSelect: (i: number) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm text-white/60">{active + 1} / {photos.length}</span>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main image */}
      <div className="relative flex flex-1 items-center justify-center px-16">
        <img
          src={photos[active].image_url}
          alt={`Photo ${active + 1}`}
          className="max-h-full max-w-full object-contain"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              aria-label="Previous"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              aria-label="Next"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto px-6 py-4">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => onSelect(i)}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === active ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-75'
              }`}
            >
              <img src={p.image_url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main gallery ─────────────────────────────────────────────────────────────

export function VenueGallery({ photos, venueName }: Props) {
  const sorted = [...photos].sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1
    if (!a.is_cover && b.is_cover) return 1
    return a.sort_order - b.sort_order
  })

  const [active, setActive]           = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const open  = (i: number) => { setActive(i); setLightboxOpen(true); document.body.style.overflow = 'hidden' }
  const close = ()          => { setLightboxOpen(false); document.body.style.overflow = '' }
  const prev  = ()          => setActive(p => (p - 1 + sorted.length) % sorted.length)
  const next  = ()          => setActive(p => (p + 1) % sorted.length)

  useEffect(() => {
    if (!lightboxOpen) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handle)
    return () => { window.removeEventListener('keydown', handle); document.body.style.overflow = '' }
  }, [lightboxOpen])

  if (sorted.length === 0) return <GalleryPlaceholder />

  const [cover, ...rest] = sorted
  const previews = rest.slice(0, 4)

  return (
    <>
      {/* ── Mobile: single image with prev/next ─────────────── */}
      <div className="md:hidden relative h-72 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-ink-800">
        <img
          src={sorted[active].image_url}
          alt={`${venueName} — photo ${active + 1}`}
          className="w-full h-full object-cover"
          onClick={() => open(active)}
        />
        {sorted.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
              {active + 1} / {sorted.length}
            </span>
          </>
        )}
      </div>

      {/* ── Desktop: Airbnb-style grid ──────────────────────── */}
      <div className="hidden md:block relative">
        <div
          className={`grid gap-2 h-[500px] overflow-hidden rounded-2xl ${
            previews.length === 0
              ? ''
              : previews.length >= 3
                ? 'grid-cols-[3fr_2fr]'
                : 'grid-cols-[4fr_1fr]'
          }`}
        >
          {/* Cover photo — left, full height */}
          <button
            onClick={() => open(0)}
            className="relative overflow-hidden group bg-zinc-100 dark:bg-ink-800"
          >
            <img
              src={cover.image_url}
              alt={venueName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </button>

          {/* Right grid: 2×2 when there's enough photos to fill it,
              otherwise a plain stack of exactly as many cells as photos —
              no placeholder tiles for venues with fewer than 3 preview photos. */}
          {previews.length > 0 && (
            <div
              className={`grid gap-2 ${
                previews.length >= 3 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-1'
              }`}
              style={previews.length < 3 ? { gridTemplateRows: `repeat(${previews.length}, 1fr)` } : undefined}
            >
              {previews.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => open(i + 1)}
                  className="relative overflow-hidden group bg-zinc-100 dark:bg-ink-800"
                >
                  <img
                    src={photo.image_url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </button>
              ))}

              {/* Fill empty cells with placeholder — only once we've committed to the 2×2 grid */}
              {previews.length >= 3 &&
                Array.from({ length: 4 - previews.length }).map((_, i) => (
                  <div key={`ph-${i}`} className="bg-zinc-100 flex items-center justify-center dark:bg-ink-800">
                    <svg className="h-6 w-6 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Show all photos button */}
        {sorted.length > 1 && (
          <button
            onClick={() => open(0)}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50 active:scale-[0.97] dark:border-ink-700 dark:bg-ink-900 dark:text-zinc-200 dark:hover:bg-ink-800"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Show all {sorted.length} photos
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          photos={sorted}
          active={active}
          onClose={close}
          onPrev={prev}
          onNext={next}
          onSelect={setActive}
        />
      )}
    </>
  )
}
