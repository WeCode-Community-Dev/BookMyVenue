import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Users, MapPin, ArrowRight, Heart } from "lucide-react"
import { fetchExploreVenues, formatVenuePrice } from "../../apis/venues"
import Reveal from "../common/Reveal"

const VENUE_SKELETON_COUNT = 6

function VenueCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="h-52 w-full animate-pulse bg-muted" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-5 w-10 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export default function ExploreVenues() {
  const navigate = useNavigate()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [liked, setLiked] = useState({})

  useEffect(() => {
    let active = true
    setLoading(true)
    setHasError(false)

    fetchExploreVenues()
      .then((venueData) => {
        if (active) setVenues(venueData)
      })
      .catch((error) => {
        console.error("Failed to fetch venues:", error)
        if (active) setHasError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <section id="explore" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Explore venues
            </span>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl">
              Spaces worth celebrating in
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Hand-picked venues for weddings, parties, conferences, and
              everything in between.
            </p>
          </div>
          <a
            href="/venues"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            View all venues
            <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: VENUE_SKELETON_COUNT }).map((_, index) => (
              <VenueCardSkeleton key={`venue-skeleton-${index}`} />
            ))}

          {!loading && venues.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
              <p className="text-base font-semibold text-foreground">
                {hasError
                  ? "We couldn't load venues right now"
                  : "No venues to show just yet"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {hasError
                  ? "Please check back in a moment — new spaces are added often."
                  : "Check back soon — we're adding new spaces all the time."}
              </p>
            </div>
          )}

          <AnimatePresence>
            {!loading &&
              venues.map((v, i) => {
                const formattedPrice = formatVenuePrice(v.price)

                return (
                  <motion.article
                    key={v.slug}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                    onClick={() => navigate(`/venues/${v.slug}`)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(27,36,29,0.12)]"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={v.image || "/placeholder.svg"}
                        alt={v.name}
                        loading="lazy"
                        decoding="async"
                        className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                        {v.type}
                      </span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setLiked((state) => ({ ...state, [v.slug]: !state[v.slug] }))
                        }}
                        aria-label="Save venue"
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur-sm transition-colors hover:text-accent"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            liked[v.slug] ? "fill-accent text-accent" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-foreground">
                          {v.name}
                        </h3>
                        {v.rating != null && (
                          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-foreground">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            {v.rating}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" /> {v.location}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" /> Up to {v.capacity}
                        </span>
                        {formattedPrice && (
                          <span className="text-sm text-muted-foreground">
                            <span className="font-serif text-lg font-semibold text-foreground">
                              {formattedPrice}
                            </span>{" "}
                            /slot
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.article>
                )
              })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
