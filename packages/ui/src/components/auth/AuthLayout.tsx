import { cn } from '../../lib/utils'

type AuthLayoutProps = {
  left: React.ReactNode
  right?: React.ReactNode
  className?: string
}

export function AuthLayout({ left, right, className }: AuthLayoutProps) {
  return (
    <div className={cn('flex min-h-[100dvh]', className)}>
      <div className="relative flex flex-1 flex-col justify-center px-6 py-12 lg:flex-none lg:w-[480px] xl:w-[520px]">
        <div className="mx-auto w-full max-w-sm">{left}</div>
      </div>
      {right && (
        <div className="relative hidden flex-1 overflow-hidden bg-brand-black lg:flex lg:flex-col lg:border-l lg:border-white/10">
          {right}
        </div>
      )}
    </div>
  )
}
