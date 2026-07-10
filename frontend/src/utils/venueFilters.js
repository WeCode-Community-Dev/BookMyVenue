export const VENUE_CATEGORY_OPTIONS = [
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate" },
  { value: "birthday", label: "Birthday" },
  { value: "party", label: "Party" },
  { value: "function", label: "Function" },
  { value: "photoshoot", label: "Photoshoot" },
  { value: "other", label: "Other" },
];

export const VENUE_CATEGORIES = [
  { value: "all", label: "All" },
  ...VENUE_CATEGORY_OPTIONS,
];

const CATEGORY_LABEL_BY_VALUE = Object.fromEntries(
  VENUE_CATEGORY_OPTIONS.map(({ value, label }) => [value, label])
);

const LEGACY_CATEGORY_SLUGS = {
  meetings: "corporate",
  meeting: "corporate",
};

export const normalizeCategorySlug = (value) => {
  if (value == null || typeof value !== "string") return "";

  const normalized = value.trim().toLowerCase();

  if (!normalized) return "";

  if (CATEGORY_LABEL_BY_VALUE[normalized]) {
    return normalized;
  }

  return LEGACY_CATEGORY_SLUGS[normalized] || "";
};

export const getCategoryLabel = (value) => {
  const slug = normalizeCategorySlug(value);

  if (slug) {
    return CATEGORY_LABEL_BY_VALUE[slug];
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return "General";
};

export const isValidCategorySlug = (value) =>
  Boolean(normalizeCategorySlug(value));

export const SORT_OPTIONS = [
  { value: "price-asc", label: "Price Low to High" },
  { value: "price-desc", label: "Price High to Low" },
  { value: "capacity-asc", label: "Capacity Low to High" },
  { value: "capacity-desc", label: "Capacity High to Low" },
];

export const DEFAULT_VENUE_FILTERS = {
  search: "",
  category: "all",
  city: "all",
  minCapacity: "",
  sort: "price-asc",
};

const matchesCategory = (venueCategory, filterCategory) => {
  if (filterCategory === "all") return true;
  if (!venueCategory) return false;

  const venueSlug =
    normalizeCategorySlug(venueCategory) || venueCategory.trim().toLowerCase();

  return venueSlug === filterCategory.toLowerCase();
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
  if (filters.minCapacity !== "") count += 1;

  return count;
};

const sortVenues = (venues, sort) => {
  const sorted = [...venues];

  switch (sort) {
    case "price-desc":
      return sorted.sort((a, b) => Number(b.price) - Number(a.price));
    case "capacity-asc":
      return sorted.sort((a, b) => Number(a.capacity) - Number(b.capacity));
    case "capacity-desc":
      return sorted.sort((a, b) => Number(b.capacity) - Number(a.capacity));
    case "price-asc":
    default:
      return sorted.sort((a, b) => Number(a.price) - Number(b.price));
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

    if (minCapacity != null) {
      if (Number(venue.capacity) < minCapacity) return false;
    }

    return true;
  });

  return sortVenues(filtered, filters.sort);
};
