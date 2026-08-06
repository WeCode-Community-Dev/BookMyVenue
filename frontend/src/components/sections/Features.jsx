import {
  Search,
  CalendarCheck,
  CreditCard,
  MessagesSquare,
  SlidersHorizontal,
  BarChart3,
} from "lucide-react"
import Reveal from "../common/Reveal"

const features = [
  {
    icon: Search,
    title: "Smart venue discovery",
    desc: "Filter by location, capacity, budget, and event type to find spaces that fit your vision in seconds.",
  },
  {
    icon: CalendarCheck,
    title: "Real-time availability",
    desc: "See live calendars and lock in your date instantly — no back-and-forth emails or waiting.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    desc: "Pay deposits and balances safely with encrypted checkout and transparent, no-surprise pricing.",
  },
  {
    icon: MessagesSquare,
    title: "Direct messaging",
    desc: "Chat with venue owners, ask questions, and share event details all in one place.",
  },
  {
    icon: SlidersHorizontal,
    title: "Owner dashboard",
    desc: "Owners manage listings, photos, pricing, and availability from a single intuitive control panel.",
  },
  {
    icon: BarChart3,
    title: "Insights & analytics",
    desc: "Track views, bookings, and revenue with clear reports that help your venue grow.",
  },
]

export default function Features() {
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Everything in one place
          </span>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl">
            Built for guests and venue owners alike
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Whether you&apos;re planning the perfect celebration or managing a
            space, BookMyVenue gives you the tools to do it beautifully.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group h-full rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(27,36,29,0.08)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
