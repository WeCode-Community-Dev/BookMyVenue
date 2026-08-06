export function sortLocationGroups(locationGroups) {
  return [...locationGroups]
    .map((district) => ({
      ...district,
      cities: [...(district.cities ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function flattenLocationGroups(locationGroups) {
  return sortLocationGroups(locationGroups).flatMap((district) =>
    (district.cities ?? []).map((city) => ({
      ...city,
      districtId: district.id,
      districtName: district.name,
    })),
  )
}

export function findCityInGroups(locationGroups, cityId) {
  if (cityId == null) return null

  for (const district of locationGroups) {
    const city = (district.cities ?? []).find((item) => item.id === cityId)
    if (city) {
      return {
        ...city,
        districtId: district.id,
        districtName: district.name,
      }
    }
  }

  return null
}

export function filterCitiesForPicker(locationGroups, query) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  return flattenLocationGroups(locationGroups)
    .filter(
      (city) =>
        city.name.toLowerCase().includes(normalized) ||
        city.districtName.toLowerCase().includes(normalized),
    )
    .sort((a, b) => a.name.localeCompare(b.name))
}
