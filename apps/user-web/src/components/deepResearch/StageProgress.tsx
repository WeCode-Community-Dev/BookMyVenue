import { CheckCircle2, Loader2, Search, ListFilter, Sparkles } from 'lucide-react'

export type ResearchStage = 'understanding' | 'matching' | 'ranking' | 'done'

const STAGE_ORDER: ResearchStage[] = ['understanding', 'matching', 'ranking', 'done']

const STAGES: { key: ResearchStage; icon: typeof Sparkles; label: string; sublabel: string }[] = [
  {
    key: 'understanding',
    icon: Sparkles,
    label: 'Understanding your request',
    sublabel: 'Parsing intent, location, capacity and requirements',
  },
  {
    key: 'matching',
    icon: Search,
    label: 'Searching the Venue404 catalog',
    sublabel: 'Matching against verified venues',
  },
  {
    key: 'ranking',
    icon: ListFilter,
    label: 'Ranking best options',
    sublabel: 'Weighing relevance and availability',
  },
]

function statusOf(stage: ResearchStage, current: ResearchStage): 'done' | 'active' | 'pending' {
  const currentIdx = STAGE_ORDER.indexOf(current)
  const stageIdx = STAGE_ORDER.indexOf(stage)
  if (stageIdx < currentIdx) return 'done'
  if (stageIdx === currentIdx) return 'active'
  return 'pending'
}

export function StageProgress({ current }: { current: ResearchStage }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/60 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03]">
      <ul className="space-y-0">
        {STAGES.map((s, i) => {
          const status = statusOf(s.key, current)
          const Icon = s.icon
          const isLast = i === STAGES.length - 1
          return (
            <li key={s.key} className="relative flex gap-4 pb-7 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute left-[15px] top-8 h-full w-px transition-colors duration-500 ${
                    status === 'done' ? 'bg-brand/60 dark:bg-brand-secondary/60' : 'bg-zinc-200 dark:bg-white/10'
                  }`}
                  aria-hidden="true"
                />
              )}

              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  status === 'done'
                    ? 'border-brand bg-brand/10 text-brand dark:border-brand-secondary dark:bg-brand-secondary/20 dark:text-brand-secondary'
                    : status === 'active'
                      ? 'border-brand bg-brand/5 text-brand shadow-[0_0_0_4px_rgba(40,90,72,0.12)] dark:border-brand-secondary dark:bg-brand-secondary/10 dark:text-brand-secondary dark:shadow-[0_0_0_4px_rgba(64,138,113,0.15)]'
                      : 'border-zinc-200 bg-zinc-100 text-zinc-300 dark:border-white/15 dark:bg-white/5 dark:text-white/25'
                }`}
              >
                {status === 'done' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : status === 'active' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </span>

              <div className="pt-0.5">
                <p
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    status === 'pending' ? 'text-zinc-400 dark:text-white/35' : 'text-zinc-900 dark:text-white'
                  }`}
                >
                  {s.label}
                </p>
                <p
                  className={`mt-0.5 text-xs leading-relaxed transition-colors duration-300 ${
                    status === 'pending' ? 'text-zinc-300 dark:text-white/20' : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {s.sublabel}
                </p>

                {status === 'active' && s.key === 'matching' && (
                  <div className="mt-3 space-y-2">
                    {[0, 1, 2].map((row) => (
                      <div
                        key={row}
                        className="h-2.5 animate-pulse rounded-full bg-zinc-200 dark:bg-white/10"
                        style={{ width: `${85 - row * 18}%`, animationDelay: `${row * 120}ms` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
