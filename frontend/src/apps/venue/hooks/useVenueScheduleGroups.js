import { useCallback, useEffect, useState } from "react"
import {
  createVenueScheduleGroup,
  deleteVenueScheduleGroup,
  fetchVenueScheduleGroups,
  isPersistedGroupId,
  parseScheduleGroupError,
  updateVenueScheduleGroup,
} from "@/apis/venueSchedules"

export function useVenueScheduleGroups({ venue, mapGroupFromApi }) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const reloadGroups = useCallback(async () => {
    if (!venue?.slug) {
      setGroups([])
      setLoading(false)
      return
    }

    setLoading(true)
    setLoadError("")

    try {
      const data = await fetchVenueScheduleGroups(venue.slug)
      setGroups(data.map(mapGroupFromApi))
    } catch (error) {
      setLoadError(parseScheduleGroupError(error))
      setGroups([])
    } finally {
      setLoading(false)
    }
  }, [venue?.slug, mapGroupFromApi])

  useEffect(() => {
    reloadGroups()
  }, [reloadGroups])

  const persistGroup = async (payload, editingGroupId) => {
    if (!venue?.slug) {
      throw new Error("Venue is not available.")
    }

    if (isPersistedGroupId(editingGroupId)) {
      return updateVenueScheduleGroup(venue.slug, editingGroupId, payload)
    }

    return createVenueScheduleGroup(venue.slug, payload)
  }

  const removeGroup = async (groupId) => {
    if (!venue?.slug) {
      throw new Error("Venue is not available.")
    }

    if (!isPersistedGroupId(groupId)) {
      setGroups((prev) => prev.filter((group) => group.id !== groupId))
      return
    }

    await deleteVenueScheduleGroup(venue.slug, groupId)
    setGroups((prev) => prev.filter((group) => group.id !== String(groupId)))
  }

  return {
    groups,
    setGroups,
    loading,
    loadError,
    reloadGroups,
    persistGroup,
    removeGroup,
  }
}
