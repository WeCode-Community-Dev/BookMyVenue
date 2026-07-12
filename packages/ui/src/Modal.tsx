import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  overlayClassName?: string
  /** Optional convenience header — omit and build your own inside `children` if you need something custom. */
  title?: string
  description?: string
  hideCloseButton?: boolean
}

export default function Modal({
  open,
  onClose,
  children,
  className,
  overlayClassName,
  title,
  description,
  hideCloseButton = false,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  // Lock body scroll, compensating for the scrollbar's width so the page
  // doesn't shift sideways when it disappears.
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = ''
    }
  }, [open])

  // Escape-to-close + minimal focus management: move focus into the dialog
  // on open, and return it to whatever triggered the modal on close. Neither
  // existed before — overlay-click was the only way to dismiss it.
  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement as HTMLElement
    panelRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  // Rendered via portal: a plain `fixed` element can be clipped or
  // mispositioned by any transformed/`position`-ed ancestor (sticky reserve
  // card, etc.) since `fixed` is relative to the nearest such ancestor, not
  // always the viewport. Mounting on document.body sidesteps that entirely.
  return createPortal(
    <div
      className={`modal-overlay-in fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${
        overlayClassName || 'bg-brand-black/80 backdrop-blur-sm'
      }`}
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        className={`modal-panel-in relative w-full overflow-hidden rounded-2xl bg-white shadow-2xl outline-none dark:bg-ink-900 ${
          className || 'max-w-lg'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideCloseButton && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="press absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-ink-800 dark:hover:text-zinc-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {(title || description) && (
          <div className={`px-6 pt-6 sm:px-8 sm:pt-8 ${title && !hideCloseButton ? 'pr-12' : ''}`}>
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
              >
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {description}
              </p>
            )}
          </div>
        )}

        {children}
      </div>

      {/*
        Self-contained motion: the old version used `animate-in fade-in
        zoom-in-95`, which only work if `tailwindcss-animate` is installed —
        it isn't referenced anywhere in theme.css. These keyframes use your
        own --ease-out-expo token and respect prefers-reduced-motion, same
        as .card-enter / .page-enter elsewhere in the design system.
      */}
      <style>{`
        @keyframes modal-overlay-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modal-panel-in {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-overlay-in { animation: modal-overlay-in 180ms var(--ease-out-expo, ease-out) both; }
        .modal-panel-in   { animation: modal-panel-in 200ms var(--ease-out-expo, ease-out) both; }
        @media (prefers-reduced-motion: reduce) {
          .modal-overlay-in, .modal-panel-in { animation: none; }
        }
      `}</style>
    </div>,
    document.body
  )
}
