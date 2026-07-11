import { useState } from 'react'
import { cn } from '../../lib/utils'

type UserMenuProps = {
  name: string
  email: string
  role?: string
  onSignOut?: () => void
  className?: string
}

export function UserMenu({ name, email, role, onSignOut, className }: UserMenuProps) {
  const [open, setOpen] = useState(false)

  const initials = name
    .split(' ')
    .map((n) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors duration-150 hover:bg-zinc-800/60"
        aria-expanded={open}
        aria-label="User menu"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-zinc-200">{name}</p>
          {role && <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">{role}</p>}
        </div>
        <svg
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 transition-transform duration-150',
            open && 'rotate-180',
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute bottom-full left-0 right-0 z-20 mb-1.5 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl">
            <div className="px-3 py-2.5 border-b border-zinc-800">
              <p className="text-xs font-medium text-zinc-200 truncate">{name}</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 truncate">{email}</p>
            </div>
            {onSignOut && (
              <button
                type="button"
                onClick={() => { setOpen(false); onSignOut() }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-zinc-400 dark:text-zinc-500 transition-colors duration-150 hover:bg-zinc-800 hover:text-red-400"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign out
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
