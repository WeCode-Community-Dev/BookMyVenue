import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Heart, MapPin, Search, SlidersHorizontal, Star, Users, X } from "lucide-react"
import Reveal from "../components/common/Reveal"
import LocationPickerModal from "../components/venues/LocationPickerModal"
import { fetchVenueCategories, fetchVenueLocationGroups } from "../apis/venues"
import {
  clearSavedLocationPreference,
  getSavedLocationPreference,
  setSavedLocationPreference,
} from "../services/locationPreference"
import {
  fetchVenues,
  priceRangeToParams,
  sortToOrdering,
} from "../services/venueExploreService"
import { findCityInGroups } from "../utils/groupCitiesByDistrict"

const initialFilters = {
  categoryId: null,
  cityId: null,
  price: "All",
  sort: "recommended",
}

const filterOptions = {
  price: ["All", "Below INR 10,000", "INR 10,000 - INR 25,000", "INR 25,000 - INR 50,000", "Above INR 50,000"],
  sort: [
    { value: "recommended", label: "Recommended" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating-high", label: "Rating: High to Low" },
    { value: "rating-low", label: "Rating: Low to High" },
  ],
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function getVenueLocation(venue) {
  const city = venue.city ?? venue.location
  if (!city || typeof city === "string") return city ?? ""
  const districtName =
    typeof city.district === "object" && city.district
      ? city.district.name
      : city.district
  return [city.name, districtName].filter(Boolean).join(", ")
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="min-w-0">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
    </label>
  )
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav
      aria-label="Venue pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-45"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <span className="px-3 text-sm font-medium text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </span>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-45"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

function VenueCard({ venue, liked, onToggleLike }) {
  const navigate = useNavigate()

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.45 }}
      onClick={() => navigate(`/venues/${venue.slug}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(27,36,29,0.12)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={venue.image || "/placeholder.svg"}
          alt={venue.name}
          loading="lazy"
          decoding="async"
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
          {venue.category.name}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onToggleLike()
          }}
          aria-label="Save venue"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur-sm transition-colors hover:text-accent"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-accent text-accent" : ""}`} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{venue.name}</h3>
            <p className="mt-1 text-sm font-medium text-primary">{venue.category.name}</p>
          </div>
          {venue.reviewCount > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-foreground">
              <Star className="h-4 w-4 fill-accent text-accent" />
              {venue.rating.toFixed(1)}
            </span>
          )}
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {getVenueLocation(venue)}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Up to {venue.capacity}
          </span>
          <span className="text-sm text-muted-foreground">
            <span className="font-serif text-lg font-semibold text-foreground">
              {formatCurrency(venue.price)}
            </span>{" "}
            /slot
          </span>
        </div>
      </div>
    </motion.article>
  )
}

export default function ExploreVenuesPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialSearch = (location.state?.search ?? "").trim()
  const initialCategoryId = location.state?.categoryId ?? null
  const resultsRef = useRef(null)
  const isInitialLoad = useRef(true)
  const hasRestoredLocationRef = useRef(false)
  const [venues, setVenues] = useState([])
  const [categories, setCategories] = useState([{ id: null, name: "All venues" }])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [searchInput, setSearchInput] = useState(initialSearch)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [filters, setFilters] = useState({
    ...initialFilters,
    categoryId: initialCategoryId,
  })
  const [locationGroups, setLocationGroups] = useState([])
  const [loadingLocations, setLoadingLocations] = useState(true)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [liked, setLiked] = useState({})

  useEffect(() => {
    if (location.state?.search != null || location.state?.categoryId != null) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  useEffect(() => {
    let active = true

    setLoading(true)

    const priceParams = priceRangeToParams(filters.price)
    const ordering = sortToOrdering(filters.sort)

    fetchVenues({
      ...priceParams,
      ordering,
      category_id: filters.categoryId ?? undefined,
      city_id: filters.cityId ?? undefined,
      search: searchQuery || undefined,
      page,
    })
      .then(({ venues: venueData, count, totalPages: pages }) => {
        if (active) {
          setVenues(venueData)
          setTotalCount(count)
          setTotalPages(pages)
        }
      })
      .catch((error) => console.error("Failed to load venues:", error))
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [filters.categoryId, filters.cityId, filters.price, filters.sort, page, searchQuery])

  useEffect(() => {
    let active = true

    setLoadingLocations(true)
    fetchVenueLocationGroups()
      .then((groupData) => {
        if (active) {
          setLocationGroups(groupData)
        }
      })
      .catch((error) => console.error("Failed to load locations:", error))
      .finally(() => {
        if (active) {
          setLoadingLocations(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (hasRestoredLocationRef.current || loadingLocations || locationGroups.length === 0) {
      return
    }

    hasRestoredLocationRef.current = true

    if (filters.cityId != null) {
      if (!findCityInGroups(locationGroups, filters.cityId)) {
        clearSavedLocationPreference()
        setFilters((state) => ({ ...state, cityId: null }))
      }
      return
    }

    const savedLocation = getSavedLocationPreference()
    const savedCityId = savedLocation?.cityId

    if (savedCityId == null) return

    if (findCityInGroups(locationGroups, savedCityId)) {
      setFilters((state) => ({ ...state, cityId: savedCityId }))
      return
    }

    clearSavedLocationPreference()
  }, [filters.cityId, loadingLocations, locationGroups])

  useEffect(() => {
    if (!loading) {
      if (isInitialLoad.current) {
        isInitialLoad.current = false
        return
      }
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [page, loading])

  useEffect(() => {
    fetchVenueCategories()
      .then((categoryData) => setCategories(categoryData))
      .catch((error) => console.error("Failed to load categories:", error))
  }, [])

  const filteredVenues = useMemo(() => {
    if (filters.sort === "rating-high") {
      return [...venues].sort((a, b) => b.rating - a.rating)
    }

    if (filters.sort === "rating-low") {
      return [...venues].sort((a, b) => a.rating - b.rating)
    }

    return venues
  }, [filters.sort, venues])

  const categorySelectOptions = useMemo(
    () => [
      { value: "", label: "All venues" },
      ...categories
        .filter((category) => category.id != null)
        .map((category) => ({ value: String(category.id), label: category.name })),
    ],
    [categories],
  )

  const selectedCity = useMemo(
    () => findCityInGroups(locationGroups, filters.cityId),
    [locationGroups, filters.cityId],
  )

  const locationLabel = selectedCity
    ? `${selectedCity.name}, ${selectedCity.districtName}`
    : loadingLocations
      ? "Loading..."
      : "All locations"

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== "" ||
      searchInput !== "" ||
      filters.categoryId !== initialFilters.categoryId ||
      filters.cityId !== initialFilters.cityId ||
      filters.price !== initialFilters.price ||
      filters.sort !== initialFilters.sort
    )
  }, [filters, searchInput, searchQuery])

  const applySearchQuery = (value) => {
    const trimmed = value.trim()
    setSearchQuery((current) => {
      if (current !== trimmed) {
        setPage(1)
      }
      return current === trimmed ? current : trimmed
    })
  }

  const updateFilter = (key, value) => {
    setFilters((state) => ({ ...state, [key]: value }))
    if (key === "categoryId" || key === "cityId" || key === "price" || key === "sort") {
      setPage(1)
    }
  }

  const handleLocationSelect = (city) => {
    const cityId = city?.id ?? null
    updateFilter("cityId", cityId)

    if (cityId == null) {
      clearSavedLocationPreference()
    } else {
      setSavedLocationPreference(cityId)
    }
  }

  const handleSearch = (event) => {
    event.preventDefault()
    applySearchQuery(searchInput)
  }

  const clearFilters = () => {
    setSearchInput("")
    applySearchQuery("")
    clearSavedLocationPreference()
    setFilters(initialFilters)
    setPage(1)
  }

  return (
    <main className="px-4 pt-32 pb-20 sm:pt-36">
      <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                Explore venues
              </span>
              <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight tracking-tight text-foreground text-balance sm:text-6xl">
                Find the right space for every plan
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Search across cities, categories, and budgets with filters designed for quick venue shortlisting.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form
              onSubmit={handleSearch}
              className="mt-10 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-[0_12px_40px_rgba(27,36,29,0.07)] sm:flex-row sm:items-center sm:gap-1"
            >
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                disabled={loadingLocations}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 sm:w-[220px] sm:shrink-0"
              >
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate text-left">{locationLabel}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
              <span className="hidden h-7 w-px shrink-0 bg-border sm:block" />
              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <Search className="h-5 w-5 shrink-0 text-primary" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search by venue name..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("")
                    applySearchQuery("")
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </Reveal>

          <LocationPickerModal
            open={locationModalOpen}
            onClose={() => setLocationModalOpen(false)}
            locationGroups={locationGroups}
            loading={loadingLocations}
            selectedCityId={filters.cityId}
            onSelect={handleLocationSelect}
          />

          <Reveal delay={0.12}>
            <section className="mt-6">
              <div className="border-y border-border py-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <SlidersHorizontal className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-foreground">Browse by need</h2>
                    <p className="text-sm text-muted-foreground">
                      {totalCount} venues match your current view
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
                  <FilterSelect
                    label="Category"
                    value={filters.categoryId == null ? "" : String(filters.categoryId)}
                    options={categorySelectOptions}
                    onChange={(value) =>
                      updateFilter("categoryId", value === "" ? null : Number(value))
                    }
                  />
                  <FilterSelect
                    label="Price"
                    value={filters.price}
                    options={filterOptions.price}
                    onChange={(value) => updateFilter("price", value)}
                  />
                  <FilterSelect
                    label="Sort By"
                    value={filters.sort}
                    options={filterOptions.sort}
                    onChange={(value) => updateFilter("sort", value)}
                  />
                  <button
                    type="button"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                </div>
              </div>
            </section>
          </Reveal>

          <section ref={resultsRef} className="mt-10 scroll-mt-36">
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredVenues.length}</span>
                {totalCount > filteredVenues.length && (
                  <> of <span className="font-semibold text-foreground">{totalCount}</span></>
                )}{" "}
                venues
              </p>
            </div>

            {loading && (
              <div className="rounded-2xl border border-border bg-card py-16 text-center text-muted-foreground">
                Loading venues...
              </div>
            )}

            {!loading && filteredVenues.length === 0 && (
              <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
                <h2 className="font-serif text-3xl font-semibold text-foreground">No venues found</h2>
                <p className="mt-3 text-muted-foreground">No venues found matching your search criteria.</p>
              </div>
            )}

            {!loading && filteredVenues.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredVenues.map((venue) => (
                    <VenueCard
                      key={venue.slug}
                      venue={venue}
                      liked={liked[venue.slug]}
                      onToggleLike={() => setLiked((state) => ({ ...state, [venue.slug]: !state[venue.slug] }))}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {!loading && (
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </section>
        </div>
      </main>
  )
}
