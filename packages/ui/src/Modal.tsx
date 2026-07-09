import React, { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  overlayClassName?: string
}

export default function Modal({ open, onClose, children, className, overlayClassName }: ModalProps) {
  useEffect(() => {
    if (open) {
      // Compensate for the scrollbar disappearing so the page doesn't shift sideways.
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

  if (!open) return null
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all ${overlayClassName || 'bg-zinc-950/85 backdrop-blur-md'}`}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className={`bg-white dark:bg-ink-900 rounded-2xl shadow-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${className || 'max-w-lg'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
