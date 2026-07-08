import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../lib/theme'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolved, toggle } = useTheme()
  const isDark = resolved === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={`press relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-zinc-600 dark:text-zinc-400 dark:text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-ink-800 dark:bg-ink-800 dark:border-ink-800 dark:bg-ink-900 dark:text-zinc-300 dark:text-zinc-600 dark:hover:bg-ink-800 ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
