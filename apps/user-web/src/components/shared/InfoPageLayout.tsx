import type { ReactNode } from 'react'
import { AppNavbar } from './AppNavbar'
import { HomeFooter } from '../home/HomeFooter'

export type InfoPageSection = { id: string; label: string }

export function InfoPageLayout({
  title,
  subtitle,
  sections,
  children,
}: {
  title: string
  subtitle?: string
  sections?: InfoPageSection[]
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <AppNavbar />

      <main className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <div className={sections ? 'lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16' : ''}>
          {sections && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  On this page
                </p>
                <nav className="space-y-0.5 border-l border-zinc-100 dark:border-ink-800">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:hover:border-ink-600 dark:hover:text-zinc-100"
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          <div className="min-w-0 max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
              {title}
            </h1>
            {subtitle && <p className="mt-3 text-sm text-zinc-500">{subtitle}</p>}

            <div className="mt-10 space-y-10 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {children}
            </div>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  )
}

export function InfoSection({
  id,
  heading,
  children,
}: {
  id?: string
  heading: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
