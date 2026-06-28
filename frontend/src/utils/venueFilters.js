export const VENUE_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "wedding", label: "Wedding" },
  { value: "engagement", label: "Engagement" },
  { value: "reception", label: "Reception" },
  { value: "corporate", label: "Corporate" },
  { value: "conference", label: "Conference" },
  { value: "meeting", label: "Meeting" },
  { value: "birthday", label: "Birthday" },
  { value: "party", label: "Party" },
  { value: "photoshoot", label: "Photoshoot" },
  { value: "film", label: "Film Shoot" },
  { value: "yoga", label: "Yoga" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price Low to High" },
  { value: "price-desc", label: "Price High to Low" },
  { value: "capacity-desc", label: "Capacity High to Low" },
];

export const DEFAULT_VENUE_FILTERS = {
  search: "",
  category: "all",
  city: "all",
  venueType: "all",
  pricingUnit: "all",
  minCapacity: "",
  sort: "newest",
};

const matchesCategory = (venueCategory, filterCategory) => {
  if (filterCategory === "all") return true;
  if (!venueCategory) return false;

  const normalized = venueCategory.toLowerCase();
  const target = filterCategory.toLowerCase();

  return normalized === target || normalized.includes(target);
};

const parseOptionalNumber = (value) => {
  if (value === "" || value == null) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export const extractCities = (venues) => {
  const cities = new Set();

  venues.forEach((venue) => {
    const city = venue.city?.trim();
    if (city) cities.add(city);
  });

  return Array.from(cities).sort((a, b) => a.localeCompare(b));
};

export const countActiveFilters = (filters) => {
  let count = 0;

  if (filters.search.trim()) count += 1;
  if (filters.category !== "all") count += 1;
  if (filters.city !== "all") count += 1;
  if (filters.venueType !== "all") count += 1;
  if (filters.pricingUnit !== "all") count += 1;
  if (filters.minCapacity !== "") count += 1;

  return count;
};

const sortVenues = (venues, sort) => {
  const sorted = [...venues];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => Number(a.price) - Number(b.price));
    case "price-desc":
      return sorted.sort((a, b) => Number(b.price) - Number(a.price));
    case "capacity-desc":
      return sorted.sort((a, b) => Number(b.capacity) - Number(a.capacity));
    case "newest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }
};

export const filterAndSortVenues = (venues, filters) => {
  const query = filters.search.trim().toLowerCase();
  const minCapacity = parseOptionalNumber(filters.minCapacity);

  const filtered = venues.filter((venue) => {
    if (query) {
      const title = venue.title?.toLowerCase() ?? "";
      if (!title.includes(query)) return false;
    }

    if (!matchesCategory(venue.category, filters.category)) return false;

    if (filters.city !== "all") {
      const city = venue.city?.trim().toLowerCase() ?? "";
      if (city !== filters.city.toLowerCase()) return false;
    }

    if (filters.venueType !== "all") {
      if ((venue.venueType ?? "").toLowerCase() !== filters.venueType) {
        return false;
      }
    }

    if (filters.pricingUnit !== "all") {
      if ((venue.pricingUnit ?? "").toLowerCase() !== filters.pricingUnit) {
        return false;
      }
    }

    if (minCapacity != null) {
      if (Number(venue.capacity) < minCapacity) return false;
    }

    return true;
  });

  return sortVenues(filtered, filters.sort);
};
