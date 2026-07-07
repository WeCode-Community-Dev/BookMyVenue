import React, { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export default function Modal({ open, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [open])

  if (!open) return null
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/85 backdrop-blur-md p-4 sm:p-6 transition-all"
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
