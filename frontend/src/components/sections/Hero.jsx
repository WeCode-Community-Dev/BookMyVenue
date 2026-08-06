import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, Star, Calendar, ArrowRight, ShieldCheck } from "lucide-react"

const stats = [
  { value: "12,000+", label: "Venues listed" },
  { value: "180+", label: "Cities covered" },
  { value: "4.9/5", label: "Average rating" },
]

export default function Hero() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState("")

  const handleSearch = (event) => {
    event.preventDefault()
    const query = searchInput.trim()
    navigate("/venues", query ? { state: { search: query } } : undefined)
  }

  return (
    <section id="top" className="relative overflow-hidden px-4 pt-32 pb-16 sm:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-accent" />
            For guests &amp; venue owners — one platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-foreground text-balance sm:text-6xl"
          >
            Find the perfect venue. Or list your own.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            BookMyVenue connects people with extraordinary spaces for every
            occasion — and gives owners the tools to list, manage, and grow their
            bookings effortlessly.
          </motion.p>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-[0_12px_40px_rgba(27,36,29,0.07)] sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-3 px-3 py-2">
              <Search className="h-5 w-5 shrink-0 text-primary" />
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search venue"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Explore venues
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-6"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-2xl font-semibold text-foreground">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[2rem] border border-border shadow-[0_24px_60px_rgba(27,36,29,0.14)]">
            <img
              src="/venues/hero-banquet.webp"
              alt="Elegant banquet hall set up for an event"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-[480px] w-full object-cover"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute -left-3 top-8 flex items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur-sm sm:-left-6"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
              <Star className="h-5 w-5 fill-accent" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">4.9 rating</p>
              <p className="text-xs text-muted-foreground">2,400+ reviews</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.62 }}
            className="absolute -right-3 bottom-8 flex items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur-sm sm:-right-6"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Calendar className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Instant booking</p>
              <p className="text-xs text-muted-foreground">Confirm in seconds</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> Secure payments
        </span>
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> Verified venues
        </span>
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> Free cancellation
        </span>
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> 24/7 support
        </span>
      </div>
    </section>
  )
}
