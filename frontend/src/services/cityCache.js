const CACHE_KEY = "bmv_explore_cities_v2"
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

export function getCachedCities() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const { cities, cachedAt } = JSON.parse(raw)
    if (!Array.isArray(cities) || Date.now() - cachedAt > CACHE_TTL_MS) {
      return null
    }

    return cities
  } catch {
    return null
  }
}

export function setCachedCities(cities) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ cities, cachedAt: Date.now() }),
    )
  } catch {
    // Ignore quota or private-mode errors.
  }
}
