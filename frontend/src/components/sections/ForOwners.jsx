import { motion } from "framer-motion"
import { Check, TrendingUp, CalendarRange, Wallet, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import Reveal from "../common/Reveal"

const benefits = [
  "List your space in minutes with guided setup",
  "Set your own pricing, rules, and availability",
  "Get paid securely with automatic payouts",
  "Reach thousands of guests searching every day",
]

const ownerStats = [
  { icon: TrendingUp, value: "+38%", label: "Avg. booking growth" },
  { icon: CalendarRange, value: "12 min", label: "To publish a listing" },
  { icon: Wallet, value: "₹0", label: "To get started" },
]

export default function ForOwners() {
  return (
    <section id="owners" className="px-4 py-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-border bg-primary text-primary-foreground">
        <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground">
              <span className="h-2 w-2 rounded-full bg-accent" />
              For venue owners
            </span>
            <h2 className="mt-6 font-serif text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
              Turn your space into a thriving business
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-primary-foreground/80">
              Register your venue, manage every booking from one dashboard, and
              grow your revenue — without the paperwork or middlemen.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm leading-relaxed text-primary-foreground/90">
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/venue/auth"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Register your venue
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/25 px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid gap-4">
            {ownerStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-5 rounded-2xl bg-primary-foreground/10 p-6 backdrop-blur-sm"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15 text-accent">
                  <s.icon className="h-7 w-7" />
                </span>
                <div>
                  <p className="font-serif text-3xl font-semibold">{s.value}</p>
                  <p className="text-sm text-primary-foreground/75">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
