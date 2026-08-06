import { lazy, Suspense, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Categories from "../components/sections/Categories"
import ExploreVenues from "../components/sections/ExploreVenues"
import Hero from "../components/sections/Hero"

const Features = lazy(() => import("../components/sections/Features"))
const ForOwners = lazy(() => import("../components/sections/ForOwners"))
const HowItWorks = lazy(() => import("../components/sections/HowItWorks"))
const Contact = lazy(() => import("../components/sections/Contact"))

function SectionFallback() {
  return (
    <div className="px-4 py-24" aria-hidden="true">
      <div className="mx-auto max-w-6xl">
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
        <div className="mt-10 h-48 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  )
}

export default function HomePage() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return undefined

    const id = location.hash.slice(1)
    let cancelled = false

    const tryScroll = (attempt) => {
      if (cancelled) return
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      } else if (attempt < 5) {
        setTimeout(() => tryScroll(attempt + 1), 100)
      }
    }

    const timer = setTimeout(() => tryScroll(0), 50)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [location.hash, location.key])

  return (
    <main>
      <Hero />
      <Categories />
      <ExploreVenues />
      <Suspense fallback={<SectionFallback />}>
        <Features />
        <ForOwners />
        <HowItWorks />
        <Contact />
      </Suspense>
    </main>
  )
}
