import { isValidCategorySlug, normalizeCategorySlug } from "./venueFilters";

export const MAX_VENUE_IMAGES = 5;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const VENUE_FORM_FIELD_ORDER = [
  "title",
  "description",
  "category",
  "images",
  "price",
  "capacity",
  "address",
  "city",
  "state",
  "pincode",
  "amenities",
  "rules",
];

export const EMPTY_VENUE_FORM = {
  title: "",
  description: "",
  category: "",
  capacity: "",
  price: "",
  city: "",
  state: "",
  pincode: "",
  address: "",
  latitude: "",
  longitude: "",
  amenities: [],
  rules: [],
};

export const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Fall through to comma parsing
    }

    return parseCommaList(value);
  }

  return [];
};

export const mapVenueToFormValues = (venue) => ({
  title: venue?.title || "",
  description: venue?.description || "",
  category: normalizeCategorySlug(venue?.category),
  capacity: venue?.capacity != null ? String(venue.capacity) : "",
  price: venue?.price != null ? String(venue.price) : "",
  city: venue?.city || "",
  state: venue?.state || "",
  pincode: venue?.pincode || "",
  address: venue?.address || "",
  latitude:
    venue?.location?.latitude != null && venue?.location?.latitude !== ""
      ? String(venue.location.latitude)
      : "",
  longitude:
    venue?.location?.longitude != null && venue?.location?.longitude !== ""
      ? String(venue.location.longitude)
      : "",
  amenities: normalizeStringArray(venue?.amenities),
  rules: normalizeStringArray(venue?.rules),
});

export const parseCommaList = (value) => {
  if (value == null || typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const stringifyListField = (value) => {
  const list = Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : parseCommaList(value);

  return JSON.stringify(list);
};

export const addUniqueChipValue = (items, rawValue) => {
  const next = normalizeStringArray(items);
  const candidate = String(rawValue ?? "").trim();

  if (!candidate) return next;

  const exists = next.some(
    (item) => item.toLowerCase() === candidate.toLowerCase()
  );

  if (exists) return next;

  return [...next, candidate];
};

export const scrollToFirstFormError = (errors) => {
  const firstKey = VENUE_FORM_FIELD_ORDER.find((key) => errors[key]);
  if (!firstKey) return;

  const field = document.getElementById(`venue-field-${firstKey}`);
  field?.scrollIntoView({ behavior: "smooth", block: "center" });

  const focusable = field?.querySelector(
    "input:not([type=file]), textarea, select, [tabindex='0']"
  );

  focusable?.focus({ preventScroll: true });
};

export const validateVenueCoreFields = (form) => {
  const errors = {};

  if (!form?.title?.trim()) errors.title = "Title is required";
  if (!form?.description?.trim())
    errors.description = "Description is required";
  if (!form?.category?.trim()) {
    errors.category = "Category is required";
  } else if (!isValidCategorySlug(form.category)) {
    errors.category = "Please select a valid category";
  }
  if (!form?.address?.trim()) errors.address = "Address is required";

  if (!form?.capacity?.toString().trim()) {
    errors.capacity = "Capacity is required";
  } else {
    const capacity = Number(form.capacity);
    if (
      !Number.isFinite(capacity) ||
      capacity < 1 ||
      !Number.isInteger(capacity)
    ) {
      errors.capacity = "Enter a valid capacity (whole number, 1 or more)";
    }
  }

  if (!form?.price?.toString().trim()) {
    errors.price = "Price is required";
  } else {
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      errors.price = "Enter a valid price greater than 0";
    }
  }

  return errors;
};

export const validateImageSelection = (
  files,
  { maxCount = MAX_VENUE_IMAGES, currentCount = 0 } = {}
) => {
  const selected = Array.from(files || []);

  if (currentCount + selected.length > maxCount) {
    return {
      valid: false,
      files: [],
      message: `You can upload a maximum of ${maxCount} images.`,
    };
  }

  for (const file of selected) {
    if (!file.type?.startsWith("image/")) {
      return {
        valid: false,
        files: [],
        message: `"${file.name}" is not a valid image file.`,
      };
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return {
        valid: false,
        files: [],
        message: `"${file.name}" exceeds the 5MB size limit.`,
      };
    }
  }

  return { valid: true, files: selected, message: "" };
};
