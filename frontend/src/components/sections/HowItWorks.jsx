import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import Reveal from "../common/Reveal"

const guestSteps = [
  { step: "01", title: "Search & filter", desc: "Browse thousands of venues by location, capacity, budget, and event type." },
  { step: "02", title: "Compare & message", desc: "Check photos, reviews, and live availability, then message owners directly." },
  { step: "03", title: "Book & celebrate", desc: "Confirm your date with secure payment and get ready for your event." },
]

const ownerSteps = [
  { step: "01", title: "Create your listing", desc: "Add photos, amenities, capacity, and pricing with our guided setup." },
  { step: "02", title: "Manage bookings", desc: "Approve requests, sync your calendar, and chat with guests in one place." },
  { step: "03", title: "Get paid", desc: "Receive secure, automatic payouts after every confirmed booking." },
]

const faqs = [
  { q: "Is it free to list my venue?", a: "Yes. Creating an account and listing your venue is completely free. We only charge a small service fee on confirmed bookings." },
  { q: "How are payments handled?", a: "All payments are processed securely through encrypted checkout. Guests pay through the platform and owners receive automatic payouts." },
  { q: "Can I cancel a booking?", a: "Guests can cancel for free within the window set by each venue. Owners define their own flexible or strict cancellation policies." },
  { q: "What types of events are supported?", a: "Everything — weddings, corporate events, conferences, birthdays, photoshoots, pop-ups, and more across 180+ cities." },
]

function Tabs() {
  const [tab, setTab] = useState("guests")
  const steps = tab === "guests" ? guestSteps : ownerSteps
  return (
    <div>
      <div className="mx-auto flex w-fit items-center gap-1 rounded-full border border-border bg-card p-1">
        {[
          { id: "guests", label: "For guests" },
          { id: "owners", label: "For owners" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="tabPill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative rounded-2xl border border-border bg-card p-7"
          >
            <span className="font-serif text-4xl font-semibold text-accent">
              {s.step}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {s.title}
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="mx-auto mt-20 max-w-3xl">
      <h3 className="text-center font-serif text-3xl font-semibold tracking-tight text-foreground">
        Frequently asked questions
      </h3>
      <div className="mt-8 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i
          return (
            <div
              key={f.q}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-semibold text-foreground">{f.q}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-6 pb-5 leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <section id="how" className="bg-muted/40 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            How it works
          </span>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl">
            Simple for everyone
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            From first search to final celebration — and from listing to payout.
          </p>
        </Reveal>

        <div className="mt-12">
          <Tabs />
        </div>

        <Faq />
      </div>
    </section>
  )
}
