const LOCATION_PREFERENCE_KEY = "bmv_last_location_v1"

export function getSavedLocationPreference() {
  try {
    const raw = localStorage.getItem(LOCATION_PREFERENCE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    const cityId = Number(parsed?.cityId)

    if (!Number.isInteger(cityId) || cityId <= 0) {
      return null
    }

    return {
      cityId,
      savedAt: parsed?.savedAt ?? null,
    }
  } catch {
    return null
  }
}

export function setSavedLocationPreference(cityId) {
  try {
    localStorage.setItem(
      LOCATION_PREFERENCE_KEY,
      JSON.stringify({ cityId, savedAt: Date.now() }),
    )
  } catch {
    // Ignore quota or private-mode errors.
  }
}

export function clearSavedLocationPreference() {
  try {
    localStorage.removeItem(LOCATION_PREFERENCE_KEY)
  } catch {
    // Ignore storage errors.
  }
}
