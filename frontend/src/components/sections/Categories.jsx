import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { fetchVenueCategories } from "../../apis/venues"

const CATEGORY_PREVIEW_LIMIT = 6

/** In-memory cache so remounts (StrictMode, route revisits) don't flash skeletons. */
let categoriesCache = null
let categoriesRequest = null

function loadCategories() {
  if (categoriesCache) {
    return Promise.resolve(categoriesCache)
  }

  if (!categoriesRequest) {
    categoriesRequest = fetchVenueCategories()
      .then((categoryData) => {
        categoriesCache = categoryData.filter((category) => category.id != null)
        return categoriesCache
      })
      .finally(() => {
        categoriesRequest = null
      })
  }

  return categoriesRequest
}

function CategoryCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border">
      <div className="h-32 animate-pulse bg-muted sm:h-36" />
    </div>
  )
}

function CategoryCard({ category, onClick }) {
  const hasImage = Boolean(category.icon_url)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl border border-border text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40"
    >
      <div className="relative h-32 bg-muted sm:h-36">
        {hasImage ? (
          <img
            src={category.icon_url}
            alt={category.name}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-accent/10 to-muted">
            <span className="font-serif text-3xl font-semibold text-foreground/75">
              {category.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        <span className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white">
          {category.name}
        </span>
      </div>
    </button>
  )
}

export default function Categories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState(() => categoriesCache ?? [])
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(() => !categoriesCache)
  // Skip enter animation when hydrating from cache so scroll/remount doesn't flash.
  const skipEnterAnimation = useRef(Boolean(categoriesCache))

  useEffect(() => {
    let active = true

    if (categoriesCache) {
      setCategories(categoriesCache)
      setLoading(false)
      return undefined
    }

    setLoading(true)

    loadCategories()
      .then((categoryData) => {
        if (active) setCategories(categoryData)
      })
      .catch((error) => console.error("Failed to fetch categories:", error))
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const hiddenCount = Math.max(0, categories.length - CATEGORY_PREVIEW_LIMIT)

  const goToCategory = (categoryId) => {
    navigate("/venues", categoryId != null ? { state: { categoryId } } : undefined)
  }

  // Hide the section gracefully when there is genuinely nothing to show
  // (no data or a backend error), so the page layout stays intact.
  if (!loading && categories.length === 0) {
    return null
  }

  return (
    <section id="categories" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Near-fold content stays visible — Reveal opacity:0 caused a blank loading state. */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Browse by category
            </span>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl">
              Find a venue for any occasion
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Pick an event type and jump straight to the spaces built for it.
            </p>
          </div>
          <button
            type="button"
            onClick={() => goToCategory(null)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            View all venues
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-10">
          <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
            <div className="flex snap-x snap-mandatory gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-3">
              {loading
                ? Array.from({ length: CATEGORY_PREVIEW_LIMIT }).map((_, index) => (
                    <div
                      key={`category-skeleton-${index}`}
                      className="min-w-[220px] shrink-0 snap-start sm:min-w-0 sm:shrink"
                    >
                      <CategoryCardSkeleton />
                    </div>
                  ))
                : categories.map((category, index) => {
                    const hideOnDesktop =
                      !showAll && index >= CATEGORY_PREVIEW_LIMIT

                    return (
                      <motion.div
                        key={category.id}
                        initial={
                          skipEnterAnimation.current
                            ? false
                            : { opacity: 0, y: 16 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: Math.min(index, 5) * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`min-w-[220px] shrink-0 snap-start sm:min-w-0 sm:shrink ${
                          hideOnDesktop ? "sm:hidden" : ""
                        }`}
                      >
                        <CategoryCard
                          category={category}
                          onClick={() => goToCategory(category.id)}
                        />
                      </motion.div>
                    )
                  })}
            </div>
          </div>

          {/* Show more is desktop-only; mobile keeps a full horizontal scroll. */}
          {hiddenCount > 0 && (
            <div className="mt-6 hidden sm:flex sm:justify-start">
              <button
                type="button"
                onClick={() => setShowAll((current) => !current)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
              >
                {showAll
                  ? "Show fewer categories"
                  : `Show ${hiddenCount} more`}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showAll ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
