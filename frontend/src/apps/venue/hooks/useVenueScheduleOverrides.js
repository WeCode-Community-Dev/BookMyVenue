import { useCallback, useEffect, useState } from "react"
import {
  createVenueScheduleOverride,
  deleteVenueScheduleOverride,
  fetchVenueScheduleOverrides,
  isPersistedOverrideId,
  overrideFromApi,
  parseScheduleGroupError,
  updateVenueScheduleOverride,
} from "@/apis/venueSchedules"

export function useVenueScheduleOverrides(venue) {
  const [overrides, setOverrides] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const reloadOverrides = useCallback(async () => {
    if (!venue?.slug) {
      setOverrides([])
      setLoading(false)
      return
    }

    setLoading(true)
    setLoadError("")

    try {
      const data = await fetchVenueScheduleOverrides(venue.slug)
      setOverrides(data.map(overrideFromApi))
    } catch (error) {
      setLoadError(parseScheduleGroupError(error))
      setOverrides([])
    } finally {
      setLoading(false)
    }
  }, [venue?.slug])

  useEffect(() => {
    reloadOverrides()
  }, [reloadOverrides])

  const persistOverride = async (payload, editingOverrideId) => {
    if (!venue?.slug) {
      throw new Error("Venue is not available.")
    }

    if (isPersistedOverrideId(editingOverrideId)) {
      return updateVenueScheduleOverride(
        venue.slug,
        editingOverrideId,
        payload,
      )
    }

    return createVenueScheduleOverride(venue.slug, payload)
  }

  const removeOverride = async (overrideId) => {
    if (!venue?.slug) {
      throw new Error("Venue is not available.")
    }

    if (!isPersistedOverrideId(overrideId)) {
      setOverrides((prev) => prev.filter((item) => item.id !== overrideId))
      return
    }

    await deleteVenueScheduleOverride(venue.slug, overrideId)
    setOverrides((prev) =>
      prev.filter((item) => item.id !== String(overrideId)),
    )
  }

  return {
    overrides,
    setOverrides,
    loading,
    loadError,
    reloadOverrides,
    persistOverride,
    removeOverride,
  }
}
