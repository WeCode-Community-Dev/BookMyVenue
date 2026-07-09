import { cn } from '../../lib/utils'

type LoadingScreenProps = {
  message?: string
  fullScreen?: boolean
  className?: string
}

export function LoadingScreen({ message = 'Loading', fullScreen = true, className }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullScreen && 'min-h-[100dvh] bg-white dark:bg-ink-950',
        className,
      )}
      role="status"
      aria-label={message}
    >
      {/* Fast spinner = perceived performance improvement */}
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 dark:border-ink-700 border-t-brand" />
      <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">{message}</p>
    </div>
  )
}
