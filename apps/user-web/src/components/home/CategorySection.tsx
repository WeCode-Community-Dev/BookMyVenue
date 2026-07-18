import { useCategories } from '../../hooks/useCategories'

type Props = {
  onCategoryClick: (slug: string) => void
}

const FALLBACK_GRADIENT: Record<string, string> = {
  wedding_hall: 'from-rose-900 to-pink-950',
  banquet_hall: 'from-amber-900 to-orange-950',
  event_space: 'from-violet-900 to-purple-950',
  rooftop: 'from-sky-900 to-blue-950',
  conference_room: 'from-blue-900 to-indigo-950',
  lawn: 'from-emerald-900 to-green-950',
  auditorium: 'from-zinc-800 to-zinc-950',
  club: 'from-purple-900 to-fuchsia-950',
  resort: 'from-teal-900 to-cyan-950',
  meeting_room: 'from-slate-800 to-slate-950',
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 animate-pulse">
      <div className="lg:col-span-1 lg:row-span-2 aspect-square sm:aspect-[3/4] rounded-2xl bg-zinc-100 dark:bg-ink-800" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="aspect-[4/3] rounded-2xl bg-zinc-100 dark:bg-ink-800" />
      ))}
    </div>
  )
}

export function CategorySection({ onCategoryClick }: Props) {
  const { data: categories = [], isLoading: loading } = useCategories()

  if (!loading && categories.length === 0) return null

  return (
    <section className="bg-white py-16 sm:py-20 dark:bg-ink-950">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Find a space for your event
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {loading ? (
              'Loading categories…'
            ) : (
              <>
                Browse by venue type · {categories.length}{' '}
                {categories.length === 1 ? 'category' : 'categories'}
              </>
            )}
          </p>
        </div>

        {loading ? (
          <CategorySkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {categories.map((cat, idx) => {
              const fallback = FALLBACK_GRADIENT[cat.slug] ?? 'from-zinc-800 to-zinc-900'
              const isFeature = idx === 0

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryClick(cat.slug)}
                  aria-label={`Browse ${cat.label} venues`}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50
                    ${isFeature ? 'lg:col-span-1 lg:row-span-2' : ''}
                    ${isFeature ? 'aspect-square sm:aspect-[3/4]' : 'aspect-[4/3]'}
                    bg-gradient-to-br ${fallback}
                  `}
                >
                  {cat.banner_image && (
                    <img
                      src={cat.banner_image}
                      alt={cat.label}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5 transition-opacity duration-300 group-hover:from-black/70" />

                  <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="flex items-center gap-1 rounded-full bg-brand/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      Browse
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 p-4 sm:p-5">
                    {cat.icon && <span className="mb-1 block text-lg">{cat.icon}</span>}
                    <p
                      className={`font-bold leading-tight text-white drop-shadow-sm
                      ${isFeature ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}
                    >
                      {cat.label}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-xs font-medium text-white/70 transition-colors group-hover:text-white">
                      <span>Explore venues</span>
                      <svg
                        className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
